import { auth } from "@/app/firebase";
import { signOut } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<void> => {
  const response = await fetch(
    "https://authentication-service-967652754037.asia-east1.run.app/api/users/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || "Registration failed");
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Retrieve Firebase ID token
    const token = await userCredential.user.getIdToken();

    // Sync with backend
    const response = await fetch(
      "https://authentication-service-967652754037.asia-east1.run.app/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message || "Login failed");
    }
  } catch (err) {
    console.log("Error logging in:", err);
    throw err;
  }
};

// Logout the current user
export const logoutFromFirebase = async (): Promise<void> => {
  return await signOut(auth);
};

export const getUserProfile = async (token: string) => {
  try {
    const response = await fetch(
      "https://authentication-service-967652754037.asia-east1.run.app/api/users/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json(); 
  } catch (error) {
    console.log("Error fetching user profile:", error);
    throw error;
  }
};
