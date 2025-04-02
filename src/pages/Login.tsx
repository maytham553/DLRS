import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate("/");
        } catch (error: any) {
            // Error handling is done in the AuthContext
            alert(error?.message || "An error occurred during login");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 gap-0">
            {/* Image side */}
            <div className="hidden md:flex bg-blue-600 text-white items-center justify-center p-8">
                <div className="max-w-md mx-auto space-y-6">
                    <h3 className="text-3xl font-bold tracking-tight">Digital License Registration System</h3>
                    <p className="text-xl text-blue-100">
                        Manage and issue International Driving Permits with
                        ease.
                    </p>
                </div>
            </div>

            {/* Form side */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h3>
                        <span className="mt-1 text-gray-500">Sign in to your account</span>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full rounded-lg border-gray-300 shadow-sm 
                                        focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-lg border-gray-300 shadow-sm 
                                        focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                                    autoComplete="off"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-3 px-4 border border-transparent 
                                    rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 
                                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-colors duration-200"
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
