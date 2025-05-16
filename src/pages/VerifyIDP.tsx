import { useState, useRef } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { IDPFormData } from "../types/idp";
import {
    getIDPStatus,
    getStatusDisplay,
    getStatusBarClass,
    hasIDPExpired,
    getFormattedExpirationDate,
    getFormattedIssueDate
} from "../utils/idpUtils";

// SVG icons as components
const SearchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const IDPLogo = () => (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h.01" />
            <path d="M10.6 7h5.79" />
            <path d="M7 12h.01" />
            <path d="M10.6 12h5.79" />
            <path d="M7 17h.01" />
            <path d="M10.6 17h5.79" />
        </svg>
    </div>
);

const PrintIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
    >
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect width="12" height="8" x="6" y="14" />
    </svg>
);

// Extended IDP data type that may include createdAt from Firestore
type ExtendedIDPFormData = IDPFormData & {
    personalPhoto?: string;
    licenseFrontPhoto?: string;
    licenseBackPhoto?: string;
};

export default function VerifyIDP() {
    const [idpId, setIdpId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [idpData, setIdpData] = useState<ExtendedIDPFormData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);
    const [hasExpired, setHasExpired] = useState(false);
    const printableCardRef = useRef<HTMLDivElement>(null);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!idpId.trim()) {
            setError("Please enter an IDP ID");
            return;
        }

        setIsSearching(true);
        setError(null);
        setIdpData(null);

        try {
            // Create a query against the "idps" collection
            // Using "id" as the custom field to query (adjust if your field name is different)
            const q = query(collection(db, "idps"), where("id", "==", idpId.trim()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Get the first matching document
                const doc = querySnapshot.docs[0];
                const data = doc.data() as ExtendedIDPFormData;
                setIdpData(data);

                // Check if the IDP has expired
                setHasExpired(hasIDPExpired(data));
            } else {
                setError("No IDP found with this ID");
            }
        } catch (err) {
            setError("An error occurred while searching. Please try again.");
            console.error("Error searching for IDP:", err);
        } finally {
            setIsSearching(false);
            setSearched(true);
        }
    };

    // Handle printing the IDP card
    const handlePrint = () => {
        if (!idpData) return;

        const printContent = document.createElement('div');
        printContent.innerHTML = printableCardRef.current?.innerHTML || '';

        const originalBody = document.body.innerHTML;
        document.body.innerHTML = `
            <style>
                @page {
                    size: A4;
                    margin: 10mm;
                }
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                }
                .print-container {
                    padding: 20px;
                    max-width: 100%;
                }
                .print-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #eaeaea;
                    padding-bottom: 10px;
                }
                .print-logo {
                    width: 50px;
                    height: 50px;
                    background-color: #0f766e;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    margin-right: 15px;
                }
                .print-title {
                    font-size: 18px;
                    font-weight: bold;
                }
                .print-id {
                    font-size: 14px;
                    color: #666;
                    margin-top: 5px;
                }
                .print-status {
                    margin-left: 10px;
                    font-size: 12px;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: bold;
                }
                .print-status-approved {
                    background-color: #dcfce7;
                    color: #166534;
                }
                .print-status-canceled {
                    background-color: #fee2e2;
                    color: #b91c1c;
                }
                .print-status-expired {
                    background-color: #ffedd5;
                    color: #9a3412;
                }
                .print-content {
                    display: flex;
                    gap: 20px;
                }
                .print-photo {
                    width: 30%;
                    aspect-ratio: 3/4;
                    background-color: #f3f4f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #9ca3af;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .print-details {
                    width: 70%;
                }
                .print-section {
                    margin-bottom: 15px;
                }
                .print-section-header {
                    font-weight: bold;
                    font-size: 14px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                }
                .print-section-indicator {
                    width: 4px;
                    height: 16px;
                    margin-right: 8px;
                    border-radius: 2px;
                }
                .print-blue {
                    background-color: #2563eb;
                }
                .print-purple {
                    background-color: #9333ea;
                }
                .print-field {
                    margin-bottom: 8px;
                    display: flex;
                }
                .print-label {
                    width: 120px;
                    color: #6b7280;
                    font-size: 13px;
                }
                .print-value {
                    font-weight: 500;
                    font-size: 13px;
                }
                .print-value-expired {
                    color: #b91c1c;
                }
                .print-footer {
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 1px solid #eaeaea;
                    font-size: 11px;
                    color: #9ca3af;
                    display: flex;
                    justify-content: space-between;
                }
                .print-verification {
                    padding: 3px 10px;
                    border-radius: 15px;
                    font-size: 11px;
                    font-weight: 500;
                }
                .print-verification-approved {
                    background-color: #ecfdf5;
                    color: #065f46;
                }
                .print-verification-canceled {
                    background-color: #fef2f2;
                    color: #991b1b;
                }
                .print-verification-expired {
                    background-color: #fff7ed;
                    color: #c2410c;
                }
                @media print {
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            </style>
            <div class="print-container">
                ${printContent.innerHTML}
            </div>
        `;

        window.print();
        document.body.innerHTML = originalBody;

        // Re-attach event listeners after printing
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    // Get status classes for the verification badge
    const getVerificationClasses = (): string => {
        if (!idpData) return 'bg-green-50 text-green-600 print-verification-approved';

        const status = getIDPStatus(idpData);

        switch (status) {
            case 'canceled':
                return 'bg-red-50 text-red-600 print-verification-canceled';
            case 'approved':
                return 'bg-green-50 text-green-600 print-verification-approved';
            case 'expired':
                return 'bg-orange-50 text-orange-600 print-verification-expired';
            default:
                return 'bg-green-50 text-green-600 print-verification-approved';
        }
    };

    // Display message for the verification badge
    const getVerificationMessage = (): string => {
        if (!idpData) return 'ACTIVE';

        const status = getIDPStatus(idpData);

        switch (status) {
            case 'canceled':
                return 'CANCELED';
            case 'approved':
                return 'ACTIVE';
            case 'expired':
                return 'EXPIRED';
            default:
                return 'ACTIVE';
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="text-center mb-12">
                <div className="inline-block mb-6 px-4 py-1.5 bg-primary/10 rounded-full">
                    <span className="text-sm font-medium text-primary">Digital License Registration System</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-4">Verify Your International Driving Permit</h1>
                <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                    Enter your IDP ID below to verify the authenticity and current status of your permit
                </p>
            </div>

            <Card className="mb-10">
                <div className="p-6">
                    <form onSubmit={handleSearch}>
                        <div className="relative mb-6">
                            <div className="flex gap-4">
                                <div className="flex-grow relative">
                                    <Input
                                        type="text"
                                        value={idpId}
                                        onChange={(e) => setIdpId(e.target.value)}
                                        placeholder="Enter IDP ID (e.g. IDP-12345678)"
                                        className="h-12 pl-12"
                                        disabled={isSearching}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <SearchIcon />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSearching}
                                    className="h-12 px-8"
                                >
                                    {isSearching ? "Searching..." : "Verify"}
                                </Button>
                            </div>
                            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
                        </div>
                    </form>

                    {searched && !idpData && !isSearching && !error && (
                        <div className="text-center p-8 border border-border rounded-lg bg-card">
                            <p className="text-foreground/70">No IDP found with ID <span className="font-semibold">{idpId}</span></p>
                            <p className="mt-2 text-sm text-muted-foreground">Please check the ID and try again.</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* License-Style Results Section */}
            {searched && !error && idpData && (
                <div className="w-full mt-8 max-w mx-auto">
                    <Card className="bg-white rounded-xl overflow-hidden border-0 shadow-lg">
                        {/* Status Bar - Top colored strip */}
                        <div className={`h-1.5 w-full ${getStatusBarClass(idpData)}`}></div>

                        <div className="p-4" />

                        {/* Main Content - This will be used for printing */}
                        <div className="p-6 pt-0" ref={printableCardRef}>
                            {/* Printable Header */}
                            <div className="print-header hidden">
                                <div className="print-logo">IDP</div>
                                <div>
                                    <div className="print-title">International Driving Permit</div>
                                    <div className="print-id">ID: {idpData.id}
                                        <span className={`print-status print-status-${getIDPStatus(idpData)}`}>
                                            {getStatusDisplay(idpData).text}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 print-content">
                                {/* Photo */}
                                <div className="w-1/3 print-photo">
                                    {idpData.personalPhoto ? (
                                        <div className="rounded-xl overflow-hidden shadow-sm">
                                            <img
                                                src={idpData.personalPhoto}
                                                alt="ID Photo"
                                                className="w-full aspect-[3/4] object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center rounded-xl">
                                            <span className="text-gray-400">No Photo</span>
                                        </div>
                                    )}
                                </div>

                                {/* Personal Details */}
                                <div className="w-2/3 print-details">
                                    {/* Personal Information */}
                                    <div className="mb-5 print-section">
                                        <div className="flex items-center mb-3 print-section-header">
                                            <div className="w-1.5 h-5 bg-blue-500 rounded-sm mr-2 print-section-indicator print-blue"></div>
                                            <h3 className="text-sm font-semibold text-gray-700">Personal Information</h3>
                                        </div>

                                        <div className="space-y-3 pl-4 print-fields">
                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">First Name</span>
                                                <span className="text-sm font-medium flex-1 print-value">{idpData.name}</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Family Name</span>
                                                <span className="text-sm font-medium flex-1 print-value">{idpData.familyName}</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Date of Birth</span>
                                                <span className="text-sm font-medium flex-1 print-value">{idpData.birthDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Validity Information */}
                                    <div className="print-section">
                                        <div className="flex items-center mb-3 print-section-header">
                                            <div className="w-1.5 h-5 bg-purple-500 rounded-sm mr-2 print-section-indicator print-purple"></div>
                                            <h3 className="text-sm font-semibold text-gray-700">Validity Information</h3>
                                        </div>

                                        <div className="space-y-3 pl-4 print-fields">
                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Issued On</span>
                                                <span className="text-sm font-medium flex-1 print-value">{getFormattedIssueDate(idpData)}</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Valid For</span>
                                                <span className="text-sm font-medium flex-1 print-value">{idpData.duration}</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Expires On</span>
                                                <span className={`text-sm font-medium flex-1 ${hasExpired && getIDPStatus(idpData) === 'approved' ? 'text-orange-600' : ''} print-value`}>
                                                    {getFormattedExpirationDate(idpData)}
                                                </span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Status</span>
                                                <span className={`text-sm font-medium flex-1 ${getIDPStatus(idpData) === 'canceled' ? 'text-red-600' :
                                                    getIDPStatus(idpData) === 'expired' ? 'text-orange-600' :
                                                        'text-green-600'
                                                    } print-value`}>
                                                    {getStatusDisplay(idpData).text}
                                                    {hasExpired && getIDPStatus(idpData) === 'approved' && (
                                                        <span className="ml-2 text-xs text-orange-500">(Expiration date passed)</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center print-footer">
                                <div className={`
                                    px-3 py-1 rounded-full text-xs font-medium 
                                    ${getVerificationClasses()}
                                    shadow-sm print-verification
                                `}>
                                    {getVerificationMessage()}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Features Section */}
            <div className="w-full mt-20 md:mt-32 print:hidden">
                <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Why Verify?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6 rounded-xl border bg-card hover:shadow-sm transition-all">
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <span className="text-lg text-primary">{feature.icon}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-foreground/70">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const features = [
    {
        icon: "🔍",
        title: "Ensure Authenticity",
        description: "Verify that an IDP is legitimate and issued by authorized authorities."
    },
    {
        icon: "🛡️",
        title: "Prevent Fraud",
        description: "Protect yourself from counterfeit or fraudulent International Driving Permits."
    },
    {
        icon: "✅",
        title: "Peace of Mind",
        description: "Confirm the validity of an IDP before accepting it or using it for identification."
    }
]; 