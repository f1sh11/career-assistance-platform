// app/matching/requests/page.js
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import MatchingSidebar from "../../components/MatchingSidebar";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const router = useRouter();

  const getToken = () => sessionStorage.getItem("token") || localStorage.getItem("token");

  const fetchRequests = async () => {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/api/matching/requests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRequests(data.requests || []);
  };

  const handleAction = async (id, action, targetUserId) => {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/api/matching/request/${id}/${action}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(action === "accept" ? "Request accepted" : "Request rejected");

      if (action === "accept" && data.postId && targetUserId) {
        const goToChat = confirm("Request accepted. Do you want to start chatting now?");
        if (goToChat) {
          router.push(`/chat?post=${data.postId}&target=${targetUserId}`);
        } else {
          router.push("/matching/history");
        }
      } else {
        fetchRequests();
      }
    } else {
      toast.error(data.message || "Action failed");
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("role", data?.user?.role || "mentor");
      });

    fetchRequests();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 pt-24 text-black">
      <MatchingSidebar showReturn={true} />
      <main className="ml-48 w-full px-6 py-12">
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
                  onClick={() => handleAction(r._id, "accept", r.requester._id)}
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
      </main>
    </div>
  );
}


