"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else {
      setMentors([
        { name: "John Mentor", id: 1 },
        { name: "Jane Mentor", id: 2 },
      ]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-[100px] px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6 text-center text-black">Mentors</h1>
      <div className="bg-white rounded shadow p-6 space-y-4 max-w-3xl mx-auto">
        {mentors.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-4 rounded-md"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <p className="text-black">{item.name}</p>
            </div>
            <button
              onClick={() => toast.success(`Connected with ${item.name}`)}
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
