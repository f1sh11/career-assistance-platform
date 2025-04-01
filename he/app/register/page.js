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

    if (!role || !identifier || !password) {
      setError("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        identifier,
        password,
        role,
      });

      setSuccess("✅ Registration successful!");
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
          Create an Account
        </h2>

        <label className="block font-medium mb-2 text-gray-700">Select Identity</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        >
          <option value="">-- Choose Role --</option>
          <option value="student">Student</option>
          <option value="mentor">Mentor (Career Advisor)</option>
          <option value="industry">Industry Professional</option>
          <option value="admin">Administrator</option>
        </select>

        <label className="block font-medium mb-2 text-gray-700">Identifier</label>
        <input
          type="text"
          placeholder="Enter student ID or email"
          className="border p-2 w-full rounded mb-4"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <label className="block font-medium mb-2 text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          className="border p-2 w-full rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 w-full rounded transition duration-200">
          Register
        </button>

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 text-sm hover:underline">
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}
