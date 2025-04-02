import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
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
        <Layout>
            <div>
                {/* Image side */}
                <div>
                    <div>
                        <h3>Digital License Registration System</h3>
                        <p>
                            Manage and issue International Driving Permits with
                            ease.
                        </p>
                    </div>
                </div>

                {/* Form side */}
                <div>
                    <div>
                        <h3>Welcome back</h3>
                        <span>Sign in to your account</span>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div>
                            <div>
                                <span>Email</span>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    color="gray.900"
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <span color="gray.700">Password</span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    color="gray.900"
                                    autoComplete="off"
                                />
                            </div>

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
