"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function HistoryPage() {
  const [viewedUsers, setViewedUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else {
      const stored = JSON.parse(localStorage.getItem("viewedUsers")) || [];
      setViewedUsers(stored);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-[100px] px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6 text-center text-black">Browsing History</h1>

      {viewedUsers.length === 0 ? (
        <p className="text-center text-gray-500">You haven't viewed any profiles yet.</p>
      ) : (
        <div className="bg-white rounded shadow p-6 space-y-4 max-w-3xl mx-auto">
          {viewedUsers.map((name, index) => (
            <div
              key={index}
              className="flex justify-between items-center border p-4 rounded-md"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <p className="text-black">{name}</p>
              </div>
              <span className="text-sm text-gray-500">Viewed</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
