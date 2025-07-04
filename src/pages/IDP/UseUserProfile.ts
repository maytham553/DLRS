import { getUserProfile } from "@/services/firebase";
import { useEffect, useState } from "react";

interface UserProfile {
  name: string;
  code: string;
  role: string;
}

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile as UserProfile);
      } catch {
        setError("Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return {
    userProfile,
    loading,
    error,
    isAdmin: userProfile?.role === "admin",
  };
};
