"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AccountPage() {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-[15px]">
      {/* 顶部欢迎横幅区域 */}
      <div className="relative w-full h-[500px]">
        <Image
          src="/Curtin5.jpg"
          alt="Dashboard Banner"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black/40 backdrop-blur-sm z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, {username}!
          </h1>
          <p className="text-lg font-light">
            This is your personal dashboard overview.
          </p>
        </div>
      </div>

      {/* 信息卡片区域 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-6">
        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-black font-semibold mb-2">🔔 Notifications</h2>
          <p className="text-gray-600">You have 2 unread notifications.</p>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-black font-semibold mb-2">🛡️ Security</h2>
          <p className="text-gray-600">Your account is secured with 2FA.</p>
        </div>

        {/* Last login */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-black font-semibold mb-2">📅 Last Login</h2>
          <p className="text-gray-600">April 20, 2025, 21:34</p>
        </div>
      </div>
    </div>
  );
}
