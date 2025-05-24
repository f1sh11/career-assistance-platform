"use client";

import { useState } from "react";
import {
  FaLock,
  FaClock
} from "react-icons/fa";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleChangePassword = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Please log in");

    try {
      const res = await fetch(`${API_URL}/api/users/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fbfc] py-20 px-6 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Security Settings</h2>
            <ul className="space-y-2 text-sm">
              <li className="text-blue-700 font-medium">Change Password</li>
              <li className="text-gray-600 hover:text-blue-700 cursor-pointer">Recent Logins</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-10">
          {/* Change Password */}
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaLock className="text-blue-600" /> Change Password
            </h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border rounded bg-gray-50"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded bg-gray-50"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded bg-gray-50"
            />
            <button
              onClick={handleChangePassword}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition"
            >
              Save Password
            </button>
          </div>

          {/* Login History */}
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaClock className="text-yellow-600" /> Recent Logins
            </h2>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 px-4 py-2 rounded border flex justify-between items-center">
                April 10, 2025 – 13:00 – Singapore IP
                <span className="text-green-600 font-medium">✅</span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded border flex justify-between items-center">
                April 9, 2025 – 22:30 – VPN Detected
                <span className="text-red-500 font-medium">⚠️</span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded border flex justify-between items-center">
                April 8, 2025 – 09:15 – Mobile Login
                <span className="text-blue-500 font-medium">📱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
