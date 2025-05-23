"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else {
      setAlumni([
        { name: "Tom Alumni", id: 3 },
        { name: "Linda Alumni", id: 4 },
      ]);
    }
  }, []);

  const handleConnect = (name) => {
    toast.success(`Connected with ${name}`);
    setTimeout(() => {
      router.push("/chat");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-[100px] px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6 text-center text-black">Alumni</h1>
      <div className="bg-white rounded shadow p-6 space-y-4 max-w-3xl mx-auto">
        {alumni.map((item) => (
          <div key={item.id} className="flex justify-between items-center border p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <p className="text-black">{item.name}</p>
            </div>
            <button
              onClick={() => handleConnect(item.name)}
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

