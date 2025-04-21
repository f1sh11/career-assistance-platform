"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function MatchingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
    }
  }, []);

  const roles = [
    {
      label: "Mentors",
      route: "/matching/mentors",
      icon: "🧑‍🏫",
    },
    {
      label: "Alumni",
      route: "/matching/alumni",
      icon: "🎓",
    },
    {
      label: "Professionals",
      route: "/matching/professionals",
      icon: "💼",
    },
    {
      label: "Browsing History",
      route: "/matching/history",
      icon: "🕒",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-[70px]">
      {/* 顶部背景图横幅 */}
      <div className="relative w-full h-[400px]">
        <Image
          src="/Curtin4.jpg"
          alt="Matching Banner"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black/40 backdrop-blur-sm z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Who would you like to connect with?
          </h1>
          <p className="text-lg font-light">Choose an identity below to explore</p>
        </div>
      </div>

      {/* 卡片区域 */}
      <div className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {roles.map((item, index) => (
          <button
            key={index}
            onClick={() => router.push(item.route)}
            className="w-full h-48 bg-white bg-opacity-90 rounded-xl shadow-lg flex flex-col justify-center items-center hover:bg-yellow-400 hover:text-black transition text-xl font-light text-black"
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

