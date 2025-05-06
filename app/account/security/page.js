"use client";

import { FaLock, FaShieldAlt, FaClock, FaMobileAlt, FaEnvelope, FaStar } from "react-icons/fa";

export default function SecurityPage() {
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
            <input type="password" placeholder="Current Password" className="w-full p-3 border rounded bg-gray-50" />
            <input type="password" placeholder="New Password" className="w-full p-3 border rounded bg-gray-50" />
            <input type="password" placeholder="Confirm New Password" className="w-full p-3 border rounded bg-gray-50" />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition">
              Save Password
            </button>
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