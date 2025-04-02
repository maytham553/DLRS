import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const { user } = useAuth()

    return (
        <Layout>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-auto p-6 md:p-8">
                <div className="flex flex-col gap-8">
                    {/* Header section */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent mb-4">
                            Agent Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Welcome {user?.email}! Manage your Digital License Registration System from here.
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-brand-50 p-6 rounded-lg border-l-4 border-brand-500">
                            <p className="text-sm text-gray-500">Total Applications</p>
                            <h3 className="text-lg font-bold">0</h3>
                        </div>

                        <div className="bg-accent-50 p-6 rounded-lg border-l-4 border-accent-500">
                            <p className="text-sm text-gray-500">Pending Review</p>
                            <h3 className="text-lg font-bold">0</h3>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                            <p className="text-sm text-gray-500">Approved</p>
                            <h3 className="text-lg font-bold">0</h3>
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-md font-bold">Recent Applications</h2>
                            <button className="text-sm px-4 py-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white rounded hover:bg-gradient-to-r hover:from-brand-600 hover:to-accent-600">
                                View All
                            </button>
                        </div>

                        {/* Empty state for now */}
                        <div className="p-10 bg-gray-50 rounded-md text-center border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">No applications to display yet</p>
                            <button className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600">
                                Create New Application
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4">
                        <h2 className="text-md font-bold mb-4">Quick Actions</h2>
                        <div className="flex gap-4 flex-wrap">
                            <button className="px-6 py-3 text-lg border border-brand-500 text-brand-500 rounded hover:bg-brand-50 flex items-center">
                                <span className="text-xl mr-2">🆔</span>
                                Create New IDP
                            </button>

                            <button className="px-6 py-3 text-lg border border-accent-500 text-accent-500 rounded hover:bg-accent-50 flex items-center">
                                <span className="text-xl mr-2">🔍</span>
                                Search Records
                            </button>

                            <button className="px-6 py-3 text-lg border border-gray-500 text-gray-500 rounded hover:bg-gray-50 flex items-center">
                                <span className="text-xl mr-2">📋</span>
                                Generate Reports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
