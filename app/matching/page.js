/*matching*/
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function MatchingPage() {
  const [mentors, setMentors] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
    } else {
      // Simulated fetch - Replace with real API calls
      setMentors([
        { name: "John Mentor", id: 1 },
        { name: "Jane Mentor", id: 2 },
      ]);
      setAlumni([
        { name: "Tom Alumni", id: 3 },
        { name: "Linda Alumni", id: 4 },
      ]);
      setProfessionals([
        { name: "Alex Pro", id: 5 },
        { name: "Sam Pro", id: 6 },
      ]);
    }
  }, []);

  const connectHandler = (name) => {
    toast.success(`You are now connected with ${name}`);
  };

  const renderList = (list) => (
    <div className="bg-white rounded shadow p-4 space-y-4">
      {list.map((item) => (
        <div key={item.id} className="flex justify-between items-center border p-3 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <p>{item.name}</p>
          </div>
          <button
            onClick={() => connectHandler(item.name)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Connect
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black/80 text-white">
      {/* Header */}
      <nav className="w-full bg-black text-white flex justify-between items-center px-8 py-4">
        <div className="flex items-center space-x-4">
          <Image src="/curtinlogo.png.png" alt="Curtin Singapore" width={50} height={50} />
          <span className="text-lg font-light">Curtin Singapore</span>
        </div>
        <div className="space-x-6">
          <a href="/" className="hover:text-yellow-400">Home</a>
          <a href="/community" className="hover:text-yellow-400">Community</a>
          <a href="/profile" className="hover:text-yellow-400">Profile</a>
          <a href="/chat" className="hover:text-yellow-400">Chat</a>
          <a href="/resources" className="hover:text-yellow-400">Resource</a>
        </div>
      </nav>

      {/* Background Section */}
      <div className="relative bg-cover bg-center h-64 flex items-center justify-center" style={{ backgroundImage: "url('/profile-background.jpg')" }}>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Recommended Mentors/Alumni/Industry Professionals:</h2>
          <p className="text-lg font-light mt-2">Identity: Student</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Mentors */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-5 h-5 bg-yellow-400"></div>
            <h3 className="text-xl font-semibold">Mentors</h3>
          </div>
          {renderList(mentors)}
        </div>

        {/* Alumni */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-5 h-5 bg-yellow-400"></div>
            <h3 className="text-xl font-semibold">Alumni</h3>
          </div>
          {renderList(alumni)}
        </div>

        {/* Professionals */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-5 h-5 bg-yellow-400"></div>
            <h3 className="text-xl font-semibold">Industry Professionals</h3>
          </div>
          {renderList(professionals)}
        </div>
      </div>
    </div>
  );
}