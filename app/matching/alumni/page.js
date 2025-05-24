"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AlumniPage() {
  const [users, setUsers] = useState([]);
  const [profileName, setProfileName] = useState("");
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
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
        setUsers(data.alumni || []);
      });
  }, []);

  const handleRequest = async (recipientId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/api/matching/request`, {
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

    if (res.ok) {
      toast.success("Waiting for mentor’s response");
      router.push("/matching/history");
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to send request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6 py-12 text-black">
      <h1 className="text-3xl font-semibold mb-6 text-center">Recommended Alumni</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <img
              src={`${API_URL}${user.profile.avatarUrl || "/default-avatar.png"}`}
              className="w-16 h-16 rounded-full mb-2 object-cover"
            />
            <p className="font-semibold">{user.profile.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
            <button
              onClick={() => handleRequest(user._id)}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

