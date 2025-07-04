import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export default function Navigation() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const links = [
        { name: "Home", path: "/" },
        { name: "Verify", path: "/verify-idp" },
        { name: "IDP Application", path: "/public-idp-application" }
    ];

    if (!user) {
        links.push({ name: "Login", path: "/login" });
    } else {
        links.push(
            { name: "IDP", path: "/idp" }
        );
    }

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <nav>
            {/* Contact Header */}
            <div className="bg-slate-50 dark:bg-slate-800 py-2 px-4 text-sm">
                <div className="container mx-auto flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>📧 info@iaaidg.com</span>
                    <span>📞 +1 (555) 123-4567</span>
                </div>
            </div>
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="rounded-lg flex items-center justify-center">
                            <img src="/logo_gold.png" className="w-24" />
                        </div>
                    </Link>

                    {/* Organization Text - Desktop */}
                    <div className="hidden md:block mr-auto ml-4">
                        <span className="text-sm font-medium text-foreground/70">NON GOVERNMENT ORGANIZATION</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user && (
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="ml-2 text-sm"
                            >
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex flex-col space-y-1.5 p-2 rounded-md hover:bg-accent/50"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-5 h-0.5 bg-foreground transition-transform ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`}></span>
                        <span className={`block w-5 h-0.5 bg-foreground transition-opacity ${isMenuOpen ? "opacity-0" : ""}`}></span>
                        <span className={`block w-5 h-0.5 bg-foreground transition-transform ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pt-4 pb-2">
                        <div className="flex flex-col space-y-1">
                            {links.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {user && (
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="text-sm justify-start px-4 py-3 h-auto"
                                >
                                    {isLoggingOut ? "Logging out..." : "Logout"}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
