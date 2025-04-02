import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Simple hamburger menu icon component
const HamburgerIcon = () => (
    <div className="flex flex-col space-y-1">
        <span className="block w-5 h-0.5 bg-current"></span>
        <span className="block w-5 h-0.5 bg-current"></span>
        <span className="block w-5 h-0.5 bg-current"></span>
    </div>
);

export default function Navigation() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const links = [{ name: "Home", path: "/" }];
    if (!user) {
        links.push({ name: "Login", path: "/login" });
    } else {
        links.push({ name: "Dashboard", path: "/dashboard" });
    }

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            alert("Logged out successfully");
        } catch (error) {
            alert("Error logging out");
            console.error("Logout error:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const NavLink = ({ name, path }: { name: string; path: string }) => (
        <Link to={path}>
            <div
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                    isActive(path)
                        ? "text-brand-500 bg-brand-50"
                        : "text-gray-600 hover:bg-gray-50 hover:text-brand-500"
                }`}
            >
                {name}
            </div>
        </Link>
    );

    return null;
}
