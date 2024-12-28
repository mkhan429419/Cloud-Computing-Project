"use client";
import { useState } from "react";
import { registerUser } from "../utils/auth/authClient";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await registerUser(email, password, name);
      setSuccess("Registration successful!");

      setError("");
      router.push("/login");
    } catch (err) {
      console.log("Registration error:", err);
      setError(`${err}`);
      setSuccess("");
    }
  };

  return (
    <div className="animate-gradient-x flex items-center justify-center min-h-screen bg-animated-gradient">
      <div className="w-full max-w-md bg-black rounded-lg shadow-lg p-6 shadow-red">
        <h1 className="text-2xl font-bold text-center text-red mb-4">
          Sign Up
        </h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-darkred rounded-md bg-foreground text-background focus:outline-none focus:ring-2 focus:ring-darkred"
          />
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
            onClick={() => {
              router.push("/login");
            }}
            className="text-center cursor-pointer p-2 hover:underline"
          >
            Already have an account
          </h3>
        </div>
        <button
          onClick={handleSignUp}
          className="w-full mt-4 bg-red text-black text-foreground py-2 rounded-md hover:bg-darkred hover:text-white transition duration-200"
        >
          Create Account
        </button>
        {error && <p className="mt-4 text-sm text-darkred">{error}</p>}
        {success && <p className="mt-4 text-sm text-red">{success}</p>}
      </div>
    </div>
  );
};

export default SignUpPage;
