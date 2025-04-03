import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

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
            <div className="hidden md:flex bg-primary text-white items-center justify-center p-8">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="inline-block mb-6 px-4 py-1.5 bg-white/10 rounded-full">
                        <span className="text-sm font-medium text-white">Digital License Registration System</span>
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight">Secure Digital Licensing</h3>
                    <p className="text-xl text-primary-foreground/80">
                        Manage and issue International Driving Permits with
                        ease.
                    </p>
                </div>
            </div>

            {/* Form side */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold tracking-tight">Welcome back</h3>
                        <span className="mt-1 text-foreground/70">Sign in to your account</span>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12"
                                    autoComplete="off"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12"
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
