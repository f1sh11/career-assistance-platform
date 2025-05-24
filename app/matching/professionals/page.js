// app/matching/professionals/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfessionalsPage() {
  const [users, setUsers] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [disabledRequestIds, setDisabledRequestIds] = useState([]);
  const [requestNotes, setRequestNotes] = useState({});
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setProfileName(data?.user?.profile?.name || "A student");
      });

    fetch(`${API_URL}/api/matching/recommendations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.professionals || []);
      });
  }, []);

  const handleRequest = async (recipientId) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/api/matching/request/check?recipientId=${recipientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (data.status === "connected") {
      const go = confirm("You have already matched with this professional. Go to history?");
      if (go) router.push("/matching/history");
      return;
    }

    if (data.status === "pending") {
      const go = confirm("You have already sent a request and are waiting for a response. Go to history?");
      if (go) router.push("/matching/history");
      return;
    }

    if (data.status === "rejected") {
      const go = confirm("You have been rejected by this professional. Do you want to request again?");
      if (!go) {
        setDisabledRequestIds((prev) => [...prev, recipientId]);
        setRequestNotes((prev) => ({
          ...prev,
          [recipientId]: "You have been rejected by this professional. You cannot request again within 24 hours."
        }));
        return;
      }
      router.push("/matching/history");
      return;
    }

    if (data.status === "limit") {
      alert("You have reached the maximum number of requests to this professional.");
      setDisabledRequestIds((prev) => [...prev, recipientId]);
      setRequestNotes((prev) => ({
        ...prev,
        [recipientId]: "You have reached the maximum number of requests to this professional."
      }));
      return;
    }

    const res2 = await fetch(`${API_URL}/api/matching/request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recipientId,
        message: `${profileName} is requesting your guidance.`
      })
    });

    if (res2.ok) {
      toast.success("Waiting for professional’s response");
      router.push("/matching/history");
    } else {
      const err = await res2.json();
      toast.error(err.message || "Failed to send request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6 py-12 text-black">
      <h1 className="text-3xl font-semibold mb-6 text-center">Recommended Professionals</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <img
              src={`${API_URL}${user.profile.avatarUrl || "/default-avatar.png"}`}
              className="w-16 h-16 rounded-full mb-2 object-cover"
            />
            <p className="font-semibold">{user.profile.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
            {requestNotes[user._id] && (
              <p className="text-xs text-red-500 mt-2">{requestNotes[user._id]}</p>
            )}
            <button
              onClick={() => handleRequest(user._id)}
              disabled={disabledRequestIds.includes(user._id)}
              className={`mt-4 px-4 py-2 rounded text-white ${
                disabledRequestIds.includes(user._id)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}



