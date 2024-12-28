"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthContext";
import { getUserProfile, logoutFromFirebase } from "../utils/auth/authClient";
import Link from "next/link";

interface UserProfile {
  email: string;
  name: string;
  storageUsed: number;
  dailyBandwidthUsed: number;
}

const ProfilePage = () => {
  const { token, initialized } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const fetchProfile = async () => {
    setLoadingProfile(true);
    if (token) {
      try {
        const profile = await getUserProfile(token); // Fetch profile from backend
        setUserProfile(profile);
        setError(null); // Clear error if fetching succeeds
      } catch (err) {
        console.log("Error fetching user profile:", err);
        setError("Failed to fetch user profile.");
        setUserProfile(null); // Reset profile state on error
      }
    } else {
      setError("User not logged in.");
      setUserProfile(null); // Reset profile state if no token
    }
    setLoadingProfile(false);
  };
  useEffect(() => {
    if (initialized) {
      fetchProfile(); // Fetch user profile once Firebase is initialized
    }
  }, [initialized, token]); // Re-fetch if token updates

  const handleLogout = async () => {
    try {
      await logoutFromFirebase();
      window.location.href = "/login";
    } catch (error) {
      console.log("Failed to log out:", error);
    }
  };

  return (
    <div className="animate-gradient-x w-full mx-auto min-h-screen bg-animated-gradient">
      <div className="px-10 py-5 w-full bg-black flex justify-between items-baseline">
        <div>
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          {loadingProfile ? (
            <p className="text-center">Loading user profile...</p>
          ) : userProfile ? (
            <div className="text-dark1 mb-6">
              <h1 className="text-3xl font-semibold text-center text-dark1 mb-6">
                Hello {userProfile.name}! Welcome to Vynx
              </h1>
            </div>
          ) : (
            <h2 className="text-center text-xl">No user profile available.</h2>
          )}
        </div>
        <div className="flex items-baseline">
          <Link href="/">
            <h2 className="px-4 text-lg cursor-pointer hover:underline">
              Home
            </h2>
          </Link>
          <Link href="/storage">
            <h2 className="px-4 text-lg cursor-pointer hover:underline">
              Storage
            </h2>
          </Link>
          <Link href="/profile">
            <h2 className="px-4 text-lg cursor-pointer hover:underline">
              View Profile
            </h2>
          </Link>
          <button
            onClick={handleLogout}
            className=" py-3 px-4 bg-darkred text-white text-lg outline-none rounded-3xl hover:bg-maroon "
          >
            Log Out
          </button>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-140px)] flex items-center justify-center">
        {" "}
        {/* Adjusted height */}
        <div className="inline-block shadow-lg shadow-red p-10">
          {" "}
          {/* Centered profile */}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          {loadingProfile ? (
            <p className="text-center">Loading user profile...</p>
          ) : userProfile ? (
            <div className="text-dark1 mb-6 text-xl">
              <h1>Name: {userProfile.name}</h1>
              <p className="mb-2">Email:{userProfile.email}</p>
              <p className="mb-2">
                Storage Used: {userProfile.storageUsed} bytes
              </p>
              <p>Daily Bandwidth Used:{userProfile.dailyBandwidthUsed} bytes</p>
            </div>
          ) : (
            <h2 className="text-center text-xl">No user profile available.</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
