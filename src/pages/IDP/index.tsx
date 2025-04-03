import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserIdpApplications } from "../../services/firebase";
import { IDPFormData } from "../../types/idp";
import { getIDPStatus, getStatusDisplay, hasIDPExpired } from "../../utils/idpUtils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

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
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-foreground/70">Loading your applications...</p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">International Driving Permits</h1>
                <div className="bg-destructive/10 p-4 rounded-md">
                    <p className="text-destructive">Error: {error}</p>
                    <Button
                        onClick={() => fetchApplications("")}
                        variant="destructive"
                        className="mt-2"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="inline-block mb-2 px-4 py-1.5 bg-primary/10 rounded-full">
                        <span className="text-sm font-medium text-primary">Manage Your Permits</span>
                    </div>
                    <h1 className="text-2xl font-bold">International Driving Permits</h1>
                </div>
                <Link to="/idp/application">
                    <Button size="lg" className="h-12 px-8">
                        New Application
                    </Button>
                </Link>
            </div>

            {applications.length === 0 && !isLoading && !searchTerm ? (
                <div className="bg-card p-8 rounded-lg text-center border shadow-sm">
                    <p className="text-foreground/70 mb-4">You don't have any IDP applications yet.</p>
                    <Link to="/idp/application">
                        <Button size="lg" className="h-12 px-8">
                            Create Your First Application
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Enhanced Search Box */}
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex items-center w-full relative">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Search by name..."
                                    className="w-full h-12 pl-12 pr-4"
                                    value={tempSearchTerm}
                                    onChange={(e) => setTempSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="h-12 px-6 ml-2"
                                size="lg"
                            >
                                Search
                            </Button>
                        </div>
                    </form>

                    {isLoading && (
                        <div className="flex justify-center my-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Horizontally scrollable table with sticky actions */}
                    <div className="bg-card shadow-sm rounded-lg overflow-hidden mb-4 border">
                        <div className="overflow-x-auto" role="region" aria-label="International Driving Permits Applications" tabIndex={0}>
                            <table className="min-w-full divide-y divide-border" aria-describedby="idp-applications-description">
                                <caption className="sr-only">List of your International Driving Permit applications</caption>
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">License No.</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Country</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider sticky right-0 bg-muted/50 shadow-l">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-card divide-y divide-border">
                                    {applications.length > 0 ? (
                                        applications.map((app) => {
                                            const isExpired = hasIDPExpired(app);
                                            const statusDisplay = getStatusDisplay(app);

                                            return (
                                                <tr key={app.firebaseId} className="hover:bg-muted/50 focus-within:bg-primary/5">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                        <span className="block sm:hidden font-bold text-xs text-muted-foreground mb-1">ID:</span>
                                                        {app.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                        <span className="block sm:hidden font-bold text-xs text-muted-foreground mb-1">Name:</span>
                                                        {app.name} {app.familyName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                        <span className="block sm:hidden font-bold text-xs text-muted-foreground mb-1">License:</span>
                                                        {app.licenseNumber}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                        <span className="block sm:hidden font-bold text-xs text-muted-foreground mb-1">Country:</span>
                                                        {app.residenceCountry}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                        <span className="block sm:hidden font-bold text-xs text-muted-foreground mb-1">Duration:</span>
                                                        {app.duration}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="block sm:hidden font-bold text-xs text-muted-foreground mb-1">Status:</span>
                                                        <span className={statusDisplay.className}>
                                                            {statusDisplay.text}
                                                            {isExpired && getIDPStatus(app) === 'approved' && (
                                                                <span className="ml-1 text-xs text-orange-500">!</span>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-card shadow-l">
                                                        <span className="block sm:hidden font-bold text-xs text-muted-foreground mb-1 text-left">Actions:</span>
                                                        <div className="flex justify-end space-x-3">
                                                            <Link
                                                                to={`/idp/view/${app.firebaseId}`}
                                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3"
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
                                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
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
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-muted-foreground">
                                                No applications matching your search
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {applications.length > 0 && (
                        <div className="py-3 px-4 text-sm text-muted-foreground">
                            Showing {applications.length} {applications.length === 1 ? 'record' : 'records'}
                            {applications.length === 250 && ' (maximum limit)'}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default IDPHome;
