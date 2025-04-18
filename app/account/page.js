"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AccountPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  const menuItems = [
    { label: "Settings", route: "/settings" },
    { label: "Activity", route: "/activity" },
    { label: "Notifications", route: "/notifications" },
    { label: "Security", route: "/security" },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-[80px]">
      {/* 顶部导航栏已全局引入，无需重复 */}

      {/* 图片背景区域 */}
      <div className="relative w-full h-[500px]">
        <Image
          src="/Curtin5.jpg"
          alt="Curtin Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
        />
        <div className="absolute inset-0 top-2/3 flex flex-col items-center justify-center z-10">
          <h1 className="text-white text-5xl font-bold mb-16">MY ACCOUNT</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(item.route)}
                className="w-60 h-48 bg-white bg-opacity-90 rounded-lg shadow-lg flex flex-col justify-center items-center hover:bg-yellow-400 hover:text-black transition text-2xl font-light text-black"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 灰色背景按钮区域 */}
      <div className="bg-gray-200 flex flex-col items-center py-16">
        <div className="flex flex-col items-center mt-24 space-y-8">
          <button
            onClick={() => router.push("/profile")}
            className="bg-gray-400 text-white w-300 py-4 rounded-lg text-2xl hover:bg-yellow-500 transition"
          >
            Go to Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-black text-white w-300 py-4 rounded-lg text-2xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}