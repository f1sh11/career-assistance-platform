/* register */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Register() {
  const [role, setRole] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

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
      await axios.post("http://localhost:5000/api/auth/register", {
        role,
        identifier,
        password,
      });

      setSuccess("✅ Registration successful! Redirecting to login...");
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError("❌ " + err.response.data.message);
      } else {
        setError("❌ Registration failed.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Register
        </h2>

        {/* Identity Selection */}
        <label className="block font-medium mb-2 text-black">Select Identity</label>
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setIdentifier("");
          }}
          className="border p-2 w-full rounded mb-4 text-black"
        >
          <option value="">-- Choose Role --</option>
          <option value="student">Student</option>
          <option value="mentor">Mentor (Career Advisor)</option>
          <option value="industry">Industry Professional</option>
          <option value="admin">Administrator</option>
        </select>

        {/* Identifier Input Field */}
        <label className="block font-medium mb-2 text-black">
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
        <label className="block font-medium mb-2 text-black">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          className="border p-2 w-full rounded mb-4 focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error or Success Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        {/* Register Button */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 w-full rounded transition duration-200"
        >
          Register
        </button>

        {/* Back to Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
