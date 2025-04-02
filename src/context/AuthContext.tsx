import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { signIn, signOut, onAuthChange } from '../services/firebase';

// Define the auth context type
interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    error: Error | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    error: null,
    login: async () => { },
    logout: async () => { },
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            setUser(user);
            setLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        setError(null);
        try {
            const result = await signIn(email, password);
            console.log(result);
            if (result.error) {
                setError(result.error as Error);
            }
        } catch (err) {
            setError(err as Error);
        }
    };

    // Logout function
    const logout = async () => {
        setError(null);
        try {
            const result = await signOut();
            if (result.error) {
                setError(result.error as Error);
            }
        } catch (err) {
            setError(err as Error);
        }
    };

    // Context value
    const value = {
        user,
        loading,
        error,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
}; 