"use client";

import { useEffect, useState } from "react";
import {
  FaLock,
  FaShieldAlt,
  FaClock,
  FaMobileAlt,
  FaEnvelope,
  FaStar
} from "react-icons/fa";

export default function SecurityPage() {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loginHistory, setLoginHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [showAll, setShowAll] = useState(false);

const fetchLogins = async () => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/security/logins`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  const sorted = (data.loginHistory || []).sort((a, b) => new Date(b.date) - new Date(a.date));
  setLoginHistory(sorted);
};


  const handlePasswordChange = async () => {
    if (newPw !== confirmPw) {
      return setMessage("❌ New passwords do not match.");
    }
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/security/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword: current, newPassword: newPw })
    });
    const result = await res.json();
    if (res.ok) {
      setMessage("✅ Password changed successfully.");
      setCurrent(""); setNewPw(""); setConfirmPw("");
    } else {
      setMessage("❌ " + result.message);
    }
  };

  useEffect(() => {
    fetchLogins();
  }, []);

  const visibleLogins = showAll ? loginHistory : loginHistory.slice(0, 1);

  return (
    <div className="min-h-screen bg-[#f9fbfc] py-20 px-6 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Security Settings</h2>
            <ul className="space-y-2 text-sm">
              <li className="text-blue-700 font-medium">Change Password</li>
              <li className="text-gray-600 hover:text-blue-700 cursor-pointer">Protection Overview</li>
              <li className="text-gray-600 hover:text-blue-700 cursor-pointer">Recent Logins</li>
              <li className="text-gray-600 hover:text-blue-700 cursor-pointer">Security Score</li>
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
            <input type="password" placeholder="Current Password" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full p-3 border rounded bg-gray-50" />
            <input type="password" placeholder="New Password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full p-3 border rounded bg-gray-50" />
            <input type="password" placeholder="Confirm New Password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="w-full p-3 border rounded bg-gray-50" />
            <button
              onClick={handlePasswordChange}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition"
            >
              Save Password
            </button>
            {message && <p className="text-sm text-red-600 mt-1">{message}</p>}
          </div>

          {/* Protection Overview */}
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaShieldAlt className="text-green-600" /> Protection Overview
            </h2>
            <ul className="text-sm space-y-3">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-gray-400" />
                  <span className="font-medium">Two-factor Authentication</span>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Enabled</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  <span className="font-medium">Email Verified</span>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Yes</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaMobileAlt className="text-gray-400" />
                  <span className="font-medium">Linked Phone</span>
                </div>
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">+65 •••• •••8</span>
              </li>
            </ul>
          </div>

          {/* Login History */}
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaClock className="text-yellow-600" /> Recent Logins
            </h2>
            <div className="space-y-2 text-sm">
              {loginHistory.length === 0 && (
                <div className="text-gray-400 text-sm italic">No login records found.</div>
              )}

              {visibleLogins.map((entry, i) => (
                <div
                  key={i}
                  className="bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-gray-800 font-medium">
                      {new Date(entry.date).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      IP: {entry.ip || "Unknown"} | Location: {entry.location || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Device: {(entry.device || "Unknown").slice(0, 80)}
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold text-sm mt-2 md:mt-0 self-end md:self-center">
                    {entry.status}
                  </div>
                </div>
              ))}

              {loginHistory.length > 1 && (
                <div className="text-center mt-3">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {showAll ? "Show less" : `Show ${loginHistory.length - 1} more`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Score */}
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaStar className="text-purple-600" /> Security Score
            </h2>
            <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: '84%' }}></div>
            </div>
            <p className="text-sm text-gray-700">Your security score is <span className="font-semibold text-green-600">84</span> out of 100. Great job! Consider enabling biometric login to improve further.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
