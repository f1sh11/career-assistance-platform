"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleMenuClick = (route) => {
    if (!isLoggedIn && route !== "/login") {
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
        <div className="flex items-center space-x-2 mb-2 sm:mb-0 cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/curtinlogo.png.png" alt="Curtin Singapore" width={40} height={40} />
          <h1 className="text-base sm:text-lg font-light tracking-wide">Curtin Singapore</h1>
        </div>

        {/* Menu Items */}
        <div className="flex flex-wrap justify-end gap-3 sm:gap-4 text-sm sm:text-base">
          {["Home", "Community", "Profile", "Chat", "Resource"].map((item) => (
            <button
              key={item}
              onClick={() =>
                handleMenuClick(item === "Home" ? "/" : `/${item.toLowerCase()}`)
              }
              className="hover:text-yellow-400 hover:underline underline-offset-4 transition"
            >
              {item}
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
