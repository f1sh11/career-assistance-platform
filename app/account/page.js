"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBell,
  FaShieldAlt,
  FaClock,
  FaUserFriends
} from "react-icons/fa";

export default function AccountOverviewPage() {
  const [username, setUsername] = useState("User");
  const [notifications, setNotifications] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [connections, setConnections] = useState([]);
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    // 获取通知
    fetch(`${API}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setNotifications(data.notifications || []));

    // 获取登录历史
    fetch(`${API}/api/security/logins`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = (data.loginHistory || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setLoginHistory(sorted);
      });

    // 获取连接
    fetch(`${API}/api/matching/connections`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setConnections(data.connections || []));
  }, []);

  const cards = [
    {
      title: "Notifications",
      icon: <FaBell className="text-yellow-500 w-7 h-7" />,
      description: `You have ${notifications.length} unread notification${notifications.length !== 1 ? "s" : ""}.`,
      link: "/account/notifications"
    },
    {
      title: "Security",
      icon: <FaShieldAlt className="text-green-500 w-7 h-7" />,
      description: "Your account is secured with 2FA.",
      link: "/account/security"
    },
    {
      title: "Last Login",
      icon: <FaClock className="text-blue-500 w-7 h-7" />,
      description: loginHistory[0]
        ? new Date(loginHistory[0].date).toLocaleString()
        : "No recent login",
      link: "/account/security#logins"
    },
    {
      title: "Connections",
      icon: <FaUserFriends className="text-pink-500 w-7 h-7" />,
      description: `You are connected with ${connections.length} mentor${connections.length !== 1 ? "s" : ""} / alumni.`,
      link: "/chat"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-inter text-gray-900">
      {/* Hero Banner */}
      <div className="relative h-[420px] w-full">
        <Image
          src="/Curtin5.jpg"
          alt="Dashboard Banner"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow mb-4">
            Welcome back, {username}!
          </h1>
          <p className="text-lg md:text-xl max-w-2xl font-light drop-shadow-sm">
            Explore your dashboard to stay informed, secure, and connected.
          </p>
        </div>
      </div>

      {/* Cards Section */}
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
