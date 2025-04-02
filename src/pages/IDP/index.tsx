import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserIdpApplications } from "../../services/firebase";
import { IDPFormData } from "../../types/idp";

export const IDPHome = () => {
    const [applications, setApplications] = useState<(IDPFormData & { firebaseId: string })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSearchTerm, setTempSearchTerm] = useState("");

    // Fetch applications with search from Firebase
    const fetchApplications = async (searchValue = "") => {
        setIsLoading(true);
        try {
            const { applications, error } = await getUserIdpApplications(searchValue);

            if (error) {
                throw error;
            }

            setApplications(applications as (IDPFormData & { firebaseId: string })[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load applications");
            console.error("Error loading applications:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchApplications("");
    }, []);

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(tempSearchTerm);
        fetchApplications(tempSearchTerm);
    };

    // Render loading state
    if (isLoading && applications.length === 0) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">International Driving Permits</h1>
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Loading your applications...</p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">International Driving Permits</h1>
                <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-red-600">Error: {error}</p>
                    <button
                        onClick={() => fetchApplications("")}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">International Driving Permits</h1>
                <Link
                    to="/idp/application"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    New Application
                </Link>
            </div>

            {applications.length === 0 && !isLoading && !searchTerm ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-gray-600 mb-4">You don't have any IDP applications yet.</p>
                    <Link
                        to="/idp/application"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Create Your First Application
                    </Link>
                </div>
            ) : (
                <>
                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="w-full p-2 pl-10 border rounded focus:ring-2 focus:ring-blue-500"
                                value={tempSearchTerm}
                                onChange={(e) => setTempSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 px-4 text-sm text-white bg-blue-600 rounded-r hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {isLoading && (
                        <div className="flex justify-center my-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.length > 0 ? (
                                    applications.map((app) => (
                                        <tr key={app.firebaseId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.name} {app.familyName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.licenseNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.residenceCountry}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.duration}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Approved
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No applications matching your search
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {applications.length > 0 && (
                        <div className="py-3 px-4 text-sm text-gray-500">
                            Showing {applications.length} {applications.length === 1 ? 'record' : 'records'}
                            {applications.length === 250 && ' (maximum limit)'}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
