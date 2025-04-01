"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [role, setRole] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
  
    if (token && userStr) {
      const userData = JSON.parse(userStr); // Get user from localStorage
      if (userData.role === "student") {
        router.push("/dashboard-student");
      } else if (userData.role === "mentor") {
        router.push("/dashboard-mentor");
      } else if (userData.role === "industry") {
        router.push("/dashboard-industry");
      } else if (userData.role === "admin") {
        router.push("/dashboard-admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, []);
  

  const handleLogin = async (e) => {
    e.preventDefault();

    // Form validation
    if (!role) {
      setError("⚠️ Please select your identity.");
      return;
    }
    if (!identifier || !password) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
    if (role === "student" && !/^\d+$/.test(identifier)) {
      setError("⚠️ Student ID must be numeric.");
      return;
    }
    if (role !== "student" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      setError("⚠️ Please enter a valid email.");
      return;
    }

    try {
      // Send login request
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        identifier,
        password,
      });

      const token = response.data.token;

      // ✅ BONUS: Fetch user info from /me
      const profileRes = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = profileRes.data;
      console.log("✅ Logged in user info:", userData);

      // Optional: Store userData to localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      router.push("/dashboard"); // Redirect after login
      
    } catch (err) {
      if (!err.response) {
        setError("❌ Backend server is not available.");
      } else if (err.response.status === 400) {
        setError("⚠️ Invalid credentials.");
      } else {
        setError("❌ Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login to Your Account
        </h2>

        {/* Identity Selection */}
        <label className="block font-medium mb-2 text-gray-700">Select Identity</label>
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setIdentifier(""); // Clear identifier when role changes
          }}
          className="border p-2 w-full rounded mb-4"
        >
          <option value="">-- Choose Role --</option>
          <option value="student">Student</option>
          <option value="mentor">Mentor (Career Advisor)</option>
          <option value="industry">Industry Professional</option>
          <option value="admin">Administrator</option>
        </select>


        {/* Identifier Input Field */}
        <label className="block font-medium mb-2 text-gray-700">
          {role === "student" ? "Student ID" : "Email"}
        </label>
        <input
          type={role === "student" ? "text" : "email"}
          placeholder={role === "student" ? "Enter Student ID" : "Enter Email"}
          className="border p-2 w-full rounded mb-4 focus:ring-2 focus:ring-blue-500"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        {/* Password Input */}
        <label className="block font-medium mb-2 text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          className="border p-2 w-full rounded mb-4 focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin(e)} // Support Enter key to login
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Login Button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 w-full rounded transition duration-200"
        >
          Login
        </button>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>


        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-500 text-sm hover:underline">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}
