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
                    {/* Enhanced Search Box */}
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="w-full p-3 pl-12 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                value={tempSearchTerm}
                                onChange={(e) => setTempSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 px-6 text-sm font-medium text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 transition-colors duration-200"
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

                    {/* Horizontally scrollable table with sticky actions */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
                        <div className="overflow-x-auto" role="region" aria-label="International Driving Permits Applications" tabIndex={0}>
                            <table className="min-w-full divide-y divide-gray-200" aria-describedby="idp-applications-description">
                                <caption className="sr-only">List of your International Driving Permit applications</caption>
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No.</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 shadow-l">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.length > 0 ? (
                                        applications.map((app) => (
                                            <tr key={app.firebaseId} className="hover:bg-gray-50 focus-within:bg-blue-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <span className="block sm:hidden font-bold text-xs text-gray-500 mb-1">ID:</span>
                                                    {app.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <span className="block sm:hidden font-bold text-xs text-gray-500 mb-1">Name:</span>
                                                    {app.name} {app.familyName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <span className="block sm:hidden font-bold text-xs text-gray-500 mb-1">License:</span>
                                                    {app.licenseNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <span className="block sm:hidden font-bold text-xs text-gray-500 mb-1">Country:</span>
                                                    {app.residenceCountry}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <span className="block sm:hidden font-bold text-xs text-gray-500 mb-1">Duration:</span>
                                                    {app.duration}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="block sm:hidden font-bold text-xs text-gray-500 mb-1">Status:</span>
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Approved
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white shadow-l">
                                                    <span className="block sm:hidden font-bold text-xs text-gray-500 mb-1 text-left">Actions:</span>
                                                    <div className="flex justify-end space-x-3">
                                                        <Link
                                                            to={`/idp/view/${app.firebaseId}`}
                                                            className="text-blue-600 hover:text-blue-900 bg-white px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            aria-label={`View details for ${app.name} ${app.familyName}`}
                                                        >
                                                            <span className="flex items-center">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                                </svg>
                                                                View
                                                            </span>
                                                        </Link>
                                                        <Link
                                                            to={`/idp/edit/${app.firebaseId}`}
                                                            className="text-blue-600 hover:text-blue-900 bg-white px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            aria-label={`Edit application for ${app.name} ${app.familyName}`}
                                                        >
                                                            <span className="flex items-center">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                </svg>
                                                                Edit
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No applications matching your search
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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
