// app/matching/history/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import MatchingSidebar from "../../components/MatchingSidebar";

export default function HistoryPage() {
  const [role, setRole] = useState(null);
  const [items, setItems] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const router = useRouter();

  const getToken = () =>
    sessionStorage.getItem("token") || localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Please login again.");
      router.push("/login");
      return;
    }

    const loadHistory = async () => {
      try {
        const resUser = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataUser = await resUser.json();
        const userRole = dataUser.user?.role;
        setRole(userRole);
        localStorage.setItem("role", userRole);

        const historyUrl =
          userRole === "student"
            ? `${API_URL}/api/matching/requests/sent`
            : `${API_URL}/api/matching/requests`;

        const resReq = await fetch(historyUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataReq = await resReq.json();
        setItems(dataReq.requests || []);
      } catch {
        toast.error("Failed to load request history");
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 pt-24 text-black">
      <MatchingSidebar showReturn={true} />
      <main className="ml-48 w-full px-6 py-12">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Matching Request History
        </h1>
        <div className="max-w-3xl mx-auto space-y-4">
          {items.length === 0 && (
            <p className="text-center text-gray-500">No request history found.</p>
          )}
          {items.map((r, idx) => {
            const isStudent = role === "student";
            const profile = isStudent ? r.recipient.profile : r.requester.profile;
            const id = isStudent ? r.recipient._id : r.requester._id;

            const statusColor = {
              pending: "text-yellow-600",
              accepted: "text-green-600",
              rejected: "text-red-500",
            }[r.status];

            let messageToShow = "";
            if (isStudent) {
              if (r.status === "pending") {
                messageToShow = "You are currently waiting for your mentor's response.";
              } else if (r.status === "rejected") {
                messageToShow = "Mentor has rejected your request.";
              }
            } else {
              messageToShow = r.message || "You received a request.";
            }

            return (
              <div
                key={idx}
                className="flex justify-between items-center border bg-white p-4 rounded-md shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={`${API_URL}${profile.avatarUrl || "/default-avatar.png"}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-sm text-gray-500">{messageToShow}</p>
                  </div>
                </div>
                <div className="text-right">
                  {r.status === "accepted" ? (
                    <button
                      onClick={() => router.push(`/chat?target=${id}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Connect
                    </button>
                  ) : (
                    <span className={`font-medium ${statusColor}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}



