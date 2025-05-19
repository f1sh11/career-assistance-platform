"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardMentor() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.replace("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData.role !== "mentor") {
      router.replace("/login");
    } else {
      setUser(userData);
    }
  }, []);

  const handleStart = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      router.push("/");
    }, 500); // 与 transition 时间保持一致
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-lg">Loading, please wait...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-100 flex flex-col md:flex-row transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Left: Image */}
      <div
        className="w-full md:w-1/2 bg-cover h-64 md:h-auto"
        style={{
          backgroundImage: "url('/Curtin4.jpg')",
          backgroundPosition: "80% center",
        }}
      ></div>

      {/* Right: Text Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="space-y-10 max-w-xl text-left text-black">
          <h1 className="text-3xl md:text-4xl font-bold">
            👨‍🏫 Welcome back, Mentor!
          </h1>
          <p className="text-lg mt-4">
            Here you can accept matching requests and engage with students.
          </p>
          <div className="text-right">
            <button
              className="text-xl px-10 py-4 bg-black text-yellow-400 font-semibold rounded hover:opacity-90 transition"
              onClick={handleStart}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




