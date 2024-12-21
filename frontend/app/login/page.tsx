"use client";
import { useState } from "react";
import { loginUser } from "../api/route";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      setError("");
      router.push("/"); // Redirect to home page after successful login
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="animate-gradient-x flex items-center justify-center min-h-screen bg-animated-gradient">
      <div className="w-full max-w-md bg-black rounded-lg shadow-lg p-6 shadow-red">
        <h1 className="text-2xl font-bold text-center text-red mb-4">Login</h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-darkred rounded-md bg-foreground text-background focus:outline-none focus:ring-2 focus:ring-darkred"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-darkred rounded-md bg-foreground text-background focus:outline-none focus:ring-2 focus:ring-darkred"
          />
          <h3
            onClick={() => router.push("/signup")}
            className="text-center cursor-pointer p-2 hover:underline"
          >
            Don’t have an account? Sign up
          </h3>
        </div>
        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-red text-black text-foreground py-2 rounded-md hover:bg-darkred hover:text-white transition duration-200"
        >
          Log In
        </button>
        {error && <p className="mt-4 text-sm text-darkred">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
