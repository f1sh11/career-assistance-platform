// app/matching/requests/page.js
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch(`${API_URL}/api/matching/requests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRequests(data.requests || []);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/api/matching/request/${id}/${action}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok) {
      toast.success(action === "accept" ? "Request accepted" : "Request rejected");
      fetchRequests();
    } else {
      toast.error(data.message || "Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-[100px] px-6 py-12 text-black">
      <h1 className="text-3xl font-semibold mb-6 text-center">Received Requests</h1>
      <div className="max-w-3xl mx-auto space-y-4">
        {requests.length === 0 && (
          <p className="text-center text-gray-500">No pending requests</p>
        )}
        {requests.map((r, idx) => (
          <div key={idx} className="flex justify-between items-center border bg-white p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <img
                src={`${API_URL}${r.requester.profile.avatarUrl || "/default-avatar.png"}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{r.requester.profile.name}</p>
                <p className="text-sm text-gray-500">{r.message}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => handleAction(r._id, "accept")}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => handleAction(r._id, "reject")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
