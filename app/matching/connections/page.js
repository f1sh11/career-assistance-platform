"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    fetch(`${API_URL}/api/matching/connections`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setConnections(data.connections || []);
      })
      .catch(() => toast.error("Failed to load connections."));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-[100px] px-6 py-12 text-black">
      <h1 className="text-3xl font-semibold mb-6 text-center">Your Connections</h1>
      <div className="max-w-4xl mx-auto space-y-4">
        {connections.length === 0 && (
          <p className="text-center text-gray-500">You have no active connections yet.</p>
        )}
        {connections.map((c, i) => (
          <div
            key={i}
            onClick={() => router.push(`/chat?post=${c.postId}&target=${c._id}`)}
            className="flex justify-between items-center border bg-white p-4 rounded-md shadow cursor-pointer hover:bg-yellow-100 transition"
          >
            <div className="flex items-center space-x-4">
              <img
                src={`${API_URL}${c.profile.avatarUrl || "/default-avatar.png"}`}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">{c.profile.name}</p>
                <p className="text-sm text-gray-500">{c.role}</p>
              </div>
            </div>
            <span className="text-sm text-blue-600">Chat &rarr;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
