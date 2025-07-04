import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { IDPFormData } from "../../types/idp";
import PrintIDPCard from "../../components/PrintIDPCard";
import InternationalDriverLicenseCard from "../../components/InternationalDriverLicenseCard";

// Status utility functions
const getStatusDisplay = (application: IDPFormData): { text: string; className: string } => {
    // Check if the application is canceled
    if (application.isCanceled) {
        return {
            text: 'CANCELED',
            className: 'bg-red-100 text-red-700'
        };
    }

    // Check if the application has expired
    if (application.expiryDate) {
        const expiryDate = new Date(application.expiryDate.seconds * 1000);
        if (new Date() > expiryDate) {
            return {
                text: 'EXPIRED',
                className: 'bg-orange-100 text-orange-700'
            };
        }
    }

    // Default to active
    return {
        text: 'ACTIVE',
        className: 'bg-green-100 text-green-700'
    };
};

export const IDPView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [application, setApplication] = useState<IDPFormData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasExpired, setHasExpired] = useState(false);

    useEffect(() => {
        const fetchApplication = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const docRef = doc(db, "idps", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as IDPFormData;
                    setApplication(data);

                    // Check if the IDP has expired
                    if (data.expiryDate) {
                        const expiryDate = new Date((data.expiryDate as any).seconds * 1000);
                        setHasExpired(new Date() > expiryDate);
                    }
                } else {
                    setError("Application not found");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load application");
                console.error("Error loading application:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    // Render loading state
    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">IDP Application Details</h1>
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Loading application details...</p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">IDP Application Details</h1>
                <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-red-600">Error: {error}</p>
                    <button
                        onClick={() => navigate("/idp")}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    // Render empty state
    if (!application) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">IDP Application Details</h1>
                <div className="bg-yellow-50 p-4 rounded-md">
                    <p className="text-yellow-800">Application not found</p>
                    <button
                        onClick={() => navigate("/idp")}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    // Get status display information
    const statusInfo = getStatusDisplay(application);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">IDP Application Details</h1>
                <div className="space-x-2">
                    <PrintIDPCard
                        application={application}
                        issueDate={application.issueDate ? new Date((application.issueDate as any).seconds * 1000) : null}
                        expiryDate={application.expiryDate ? new Date((application.expiryDate as any).seconds * 1000) : null}
                    />
                    <InternationalDriverLicenseCard
                        application={application}
                        issueDate={application.issueDate ? new Date((application.issueDate as any).seconds * 1000) : null}
                        expiryDate={application.expiryDate ? new Date((application.expiryDate as any).seconds * 1000) : null}
                    />
                    <Link
                        to={`/idp/edit/${id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Edit
                    </Link>
                    <Link
                        to="/idp"
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Back
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                {/* Status indicator */}
                <div className={`h-1.5 w-full ${application.isCanceled ? 'bg-red-500' :
                    hasExpired ? 'bg-orange-500' :
                        'bg-green-500'
                    }`}></div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Personal Information</h2>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                            {statusInfo.text}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">ID</p>
                            <p className="font-medium">{application.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{application.name} {application.familyName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium">{application.phoneNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">{application.gender}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Birth Date</p>
                            <p className="font-medium">{application.birthDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Birth Place</p>
                            <p className="font-medium">{application.birthPlace}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t p-6">
                    <h2 className="text-xl font-semibold mb-4">License Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">License Number</p>
                            <p className="font-medium">{application.licenseNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">License Class</p>
                            <p className="font-medium">
                                {Array.isArray(application.licenseClass)
                                    ? application.licenseClass.join(", ")
                                    : application.licenseClass}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Issuer Country</p>
                            <p className="font-medium">{application.issuerCountry}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t p-6">
                    <h2 className="text-xl font-semibold mb-4">Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Address Line 1</p>
                            <p className="font-medium">{application.addressLine1}</p>
                        </div>
                        {application.addressLine2 && (
                            <div>
                                <p className="text-sm text-gray-500">Address Line 2</p>
                                <p className="font-medium">{application.addressLine2}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-500">City</p>
                            <p className="font-medium">{application.city}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">State</p>
                            <p className="font-medium">{application.state}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Zip Code</p>
                            <p className="font-medium">{application.zipCode}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Country</p>
                            <p className="font-medium">{application.country}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Residence Country</p>
                            <p className="font-medium">{application.residenceCountry}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t p-6">
                    <h2 className="text-xl font-semibold mb-4">IDP Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">{application.duration}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Request ID Card</p>
                            <p className="font-medium">{application.requestIdCard}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Issue Date</p>
                            <p className="font-medium">
                                {application.issueDate ? new Date((application.issueDate as any).seconds * 1000).toISOString().split('T')[0] : "Not available"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Expiry Date</p>
                            <p className="font-medium">
                                {application.expiryDate ? new Date((application.expiryDate as any).seconds * 1000).toISOString().split('T')[0] : "Not available"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className={`font-medium ${application.isCanceled ? 'text-red-600' :
                                hasExpired ? 'text-orange-600' :
                                    'text-green-600'
                                }`}>
                                {statusInfo.text}
                                {hasExpired && !application.isCanceled &&
                                    <span className="ml-2 text-xs text-orange-500">(Expiration date passed)</span>
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t p-6">
                    <h2 className="text-xl font-semibold mb-4">Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Personal Photo</p>
                            <img
                                src={application.personalPhoto}
                                alt="Personal"
                                className="w-full h-auto max-h-48 object-cover rounded"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">License Front</p>
                            <img
                                src={application.licenseFrontPhoto}
                                alt="License Front"
                                className="w-full h-auto max-h-48 object-cover rounded"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">License Back</p>
                            <img
                                src={application.licenseBackPhoto}
                                alt="License Back"
                                className="w-full h-auto max-h-48 object-cover rounded"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IDPView;