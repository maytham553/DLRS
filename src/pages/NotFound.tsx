import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 h-full px-10">
            <div className="max-w-3xl mx-auto">
                <div className="inline-block mb-6 px-4 py-1.5 bg-primary/10 rounded-full">
                    <span className="text-sm font-medium text-primary">404 Error</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Page Not <span className="text-primary">Found</span>
                </h1>

                <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
                    We couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
                </p>

                <div className="flex justify-center mb-12">
                    <Link to="/">
                        <Button size="lg" className="h-12 px-8">
                            Return to Home
                        </Button>
                    </Link>
                </div>

                <div className="p-6 rounded-xl border bg-card hover:shadow-sm transition-all">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                        <span className="text-lg text-primary">🔍</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Looking for something?</h3>
                    <p className="text-foreground/70 mb-6">
                        You might want to check out these popular sections:
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link to="/verify-idp">
                            <Button variant="outline" size="sm">Verify IDP</Button>
                        </Link>
                        <Link to="/public-idp-application">
                            <Button variant="outline" size="sm">Apply for IDP</Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="sm">Login</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 