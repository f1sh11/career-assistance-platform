"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, loading } = useAuth();

  


  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userStr = sessionStorage.getItem("user");
    if (token && userStr) {
      router.push("/dashboard");
    }
  }, [router]);

  if (loading) {
    return null; // ❌ 问题在这！
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) return setError("Please select your identity.");
    if (!identifier || !password) return setError("Please fill in all fields.");
    if (role === "student" && !/^\d+$/.test(identifier))
      return setError("Student ID must be numeric.");
    if (role !== "student" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier))
      return setError("Please enter a valid email.");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        identifier,
        password,
        role: role.toLowerCase(),
      });

      const token = response.data.token;

      const profileRes = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = profileRes.data.user;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", token); // 备用写入
      login(userData);

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      if (!err.response) {
        setError("Backend server is not available.");
      } else if (err.response.status === 400) {
        setError("Invalid credentials.");
      } else if (err.response.status === 401) {
        setError("Unauthorized: Incorrect identifier, password or role.");
      } else {
        setError("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Login</h1>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setIdentifier("");
            setPassword("");
          }}
          className="border p-2 w-full rounded mb-4 text-black"
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="alumni">Alumni</option>
          <option value="industry">Industry Professional</option>
          <option value="admin">Admin</option>
        </select>
   
        <input
          type={role === "student" ? "text" : "email"}
          placeholder={role === "student" ? "Student ID" : "Email"}
          className="border p-2 w-full rounded mb-4 text-black"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded mb-4 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Login
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </div>

        <div className="mt-2 text-center text-sm">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}
