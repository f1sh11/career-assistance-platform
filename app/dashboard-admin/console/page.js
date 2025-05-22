"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUsers, FaPenFancy, FaFolderOpen, FaScroll } from "react-icons/fa";
import Image from "next/image";

export default function AdminConsolePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return router.replace("/login");
    const parsed = JSON.parse(userStr);
    if (parsed.role !== "admin") return router.replace("/login");
    setUser(parsed);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Loading admin console...
      </div>
    );
  }

  const cards = [
    {
      title: "Manage Users",
      icon: <FaUsers className="text-blue-500 w-7 h-7" />,
      description: "View, filter, and manage all registered users.",
      link: "/dashboard-admin/users"
    },
    {
      title: "Moderate Posts",
      icon: <FaPenFancy className="text-pink-500 w-7 h-7" />,
      description: "Delete inappropriate or flagged community posts.",
      link: "/dashboard-admin/posts"
    },
    {
      title: "Resource Review",
      icon: <FaFolderOpen className="text-green-600 w-7 h-7" />,
      description: "Approve or reject uploaded career materials.",
      link: "/resource/admin"
    },
    {
      title: "Audit Logs",
      icon: <FaScroll className="text-yellow-600 w-7 h-7" />,
      description: "View approval and rejection history records.",
      link: "/resource/logs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-inter text-gray-900">
      <div className="relative h-[420px] w-full">
        <Image
          src="/Curtin5.jpg"
          alt="Admin Dashboard Banner"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow mb-4">
            Welcome back, Administrator!
          </h1>
          <p className="text-lg md:text-xl max-w-2xl font-light drop-shadow-sm">
            Manage platform activities across users, content, and resources.
          </p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => router.push(card.link)}
            className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer p-6 group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="group-hover:scale-110 transition-transform">{card.icon}</div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-11">{card.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}


