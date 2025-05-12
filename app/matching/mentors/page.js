"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else {
      fetch(`${API_URL}/api/matching/recommendations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.mentors) {
            setMentors(data.mentors);
          } else {
            toast.error("No mentors found.");
          }
        })
        .catch(() => toast.error("Failed to load mentors."));
    }
  }, []);

  const handleConnect = (mentor) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/matching/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: mentor._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success(`Connected with ${mentor.profile.name || "Mentor"}`);
        setTimeout(() => {
          router.push(`/chat?target=${mentor._id}`);
        }, 800);
      })
      .catch(() => toast.error("Failed to connect."));
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-[100px] px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6 text-center text-black">Mentors</h1>
      <div className="bg-white rounded shadow p-6 space-y-4 max-w-3xl mx-auto">
        {mentors.map((item) => (
          <div key={item._id} className="flex justify-between items-center border p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <p className="text-black">{item.profile.name || "Unnamed Mentor"}</p>
            </div>
            <button
              onClick={() => handleConnect(item)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
