import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center text-center py-12 md:py-20">
            {/* Hero Section */}
            <div className="max-w-3xl mx-auto">
                <div className="inline-block mb-6 px-4 py-1.5 bg-primary/10 rounded-full">
                    <span className="text-sm font-medium text-primary">Digital License Registration System</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Secure Digital Licensing Made <span className="text-primary">Simple</span>
                </h1>

                <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
                    Welcome to DLRS, the comprehensive solution for digital license registration and management. Secure, efficient, and user-friendly.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    {user ? (
                        <>
                            <Link to="/dashboard">
                                <Button size="lg" className="h-12 px-8">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link to="/idp">
                                <Button size="lg" variant="outline" className="h-12 px-8">
                                    IDP Management
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button size="lg" className="h-12 px-8">
                                    Sign In
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="h-12 px-8">
                                Learn More
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="w-full mt-20 md:mt-32">
                <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Key Features</h2>

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
        icon: "🔒",
        title: "Secure Licensing",
        description: "Advanced encryption and security protocols ensure your license data is protected at all times."
    },
    {
        icon: "📱",
        title: "Mobile Support",
        description: "Access and manage your licenses from any device with our responsive, user-friendly interface."
    },
    {
        icon: "⚡",
        title: "Fast Processing",
        description: "Streamlined workflows enable quick license issuance and renewal with minimal waiting time."
    }
];
