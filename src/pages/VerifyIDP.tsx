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
                if (data && data.isCanceled) {
                    setError("IDP not found.");
                    return;
                }

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
                                    <div className="flex print-field mb-4">
                                        <span className="text-lg font-medium flex-1 print-value">{idpData.id}</span>
                                    </div>

                                    <div className="mb-5 print-section">

                                        <div className="space-y-3 pl-4 print-fields">
                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">First Name</span>
                                            </div>
                                            <div className="flex print-field">
                                                <span className="text-sm font-medium flex-1 print-value">{idpData.name}</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Family Name</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm font-medium flex-1 print-value">{idpData.familyName}</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Date of Birth</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm font-medium flex-1 print-value">{idpData.birthDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="print-section">

                                        <div className="space-y-3 pl-4 print-fields">
                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Issued On</span>
                                            </div>
                                            <div className="flex print-field">
                                                <span className="text-sm font-medium flex-1 print-value">{getFormattedIssueDate(idpData)}</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Valid For</span>
                                            </div>
                                            <div className="flex print-field">
                                                <span className="text-sm font-medium flex-1 print-value">{idpData.duration.split("-")[0]}</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Expires On</span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className={`text-sm font-medium flex-1 ${hasExpired && getIDPStatus(idpData) === 'approved' ? 'text-orange-600' : ''} print-value`}>
                                                    {getFormattedExpirationDate(idpData)}
                                                </span>
                                            </div>

                                            <div className="flex print-field">
                                                <span className="text-sm w-32 text-gray-500 print-label">Status</span>
                                            </div>
                                            <div className="flex print-field">
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


            {/* Trusted Car Rental Companies Section */}
            <div className="w-full my-12 py-10 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div className="container mx-auto">
                    <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto text-center">
                        We advise international driving license users to rent cars from trusted companies.
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 px-4">
                        <img src="/logos/png-transparent-national-car-rental-enterprise-rent-a-car-budget-rent-a-car-car-rental-text-logo-car.png" alt="Enterprise" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Budget-Logo.png" alt="Budget" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Thrifty-car-rental-logo.jpg" alt="Thrifty" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Hertz_logo.jpg" alt="Hertz" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/dollar.7a3cc7e0.svg" alt="Dollar" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/png-transparent-national-car-rental-enterprise-rent-a-car-budget-rent-a-car-car-rental-text-logo-car.png" alt="National" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Sixt-Logo.jpg" alt="Sixt" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Alamo_Rent_a_Car_(logo).svg.png" alt="Alamo" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/AVIS_logo_2012.svg.png" alt="Avis" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Europcar-Logo.svg.png" alt="Europcar" className="h-12 md:h-16 object-contain" />
                    </div>
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