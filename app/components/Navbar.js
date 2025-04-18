"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 检查本地 token，并监听路由变化
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken(); // 初始检查

    // 页面跳转后再次检查
    const interval = setInterval(checkToken, 1000); // 每 1 秒检查一次（更适用于 App Router）

    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (route) => {
    const publicRoutes = ["/", "/login"];
    if (!isLoggedIn && !publicRoutes.includes(route)) {
      alert("You need to log in before accessing this feature.");
      router.push("/login");
    } else {
      router.push(route);
    }
  };

  return (
    <nav className="w-full bg-black/80 backdrop-blur-md text-white fixed top-0 left-0 z-50 px-4 py-4 shadow-md">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
        {/* Logo Section */}
        <div
          className="flex items-center space-x-2 mb-2 sm:mb-0 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/curtinlogo.png.png"
            alt="Curtin Singapore"
            width={40}
            height={40}
          />
          <h1 className="text-base sm:text-lg font-light tracking-wide">
            Curtin Singapore
          </h1>
        </div>

        {/* Menu Items */}
        <div className="flex flex-wrap justify-end gap-3 sm:gap-4 text-sm sm:text-base">
          {[
            { name: "Home", route: "/" },
            { name: "Community", route: "/community" },
            { name: "Profile", route: "/profile" },
            { name: "Chat", route: "/chat" },
            { name: "Resources", route: "/resources" },
          ].map(({ name, route }) => (
            <button
              key={name}
              onClick={() => handleMenuClick(route)}
              className="hover:text-yellow-400 hover:underline underline-offset-4 transition"
            >
              {name}
            </button>
          ))}

          {/* Login/Account Button */}
          {!isLoggedIn ? (
            <button
              onClick={() => router.push("/login")}
              className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => router.push("/account")}
              className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
            >
              Account
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
