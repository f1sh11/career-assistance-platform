"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function NavbarClient({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const msg = localStorage.getItem("loginMessage");
    if (msg) {
      alert(msg);
      localStorage.removeItem("loginMessage");
    }
  }, []);

  const handleMenuClick = (route) => {
    if (!isLoggedIn && pathname === "/") {
      alert("You need to log in before accessing this feature.");
      router.push("/login");
    } else {
      router.push(route);
    }
  };

  return (
    <>
      {/* 菜单栏 */}
      <nav className="w-full bg-black text-white fixed top-0 left-0 z-50 flex justify-between items-center px-12 py-4">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image src="/curtinlogo.png.png" alt="Curtin Singapore" width={50} height={50} />
          <h1 className="text-xl font-light">Curtin Singapore</h1>
        </div>
        <div className="space-x-8 text-lg">
          <button onClick={() => handleMenuClick("/")} className="hover:text-yellow-400">Home</button>
          <button onClick={() => handleMenuClick("/community")} className="hover:text-yellow-400">Community</button>
          <button onClick={() => handleMenuClick("/profile")} className="hover:text-yellow-400">Profile</button>
          <button onClick={() => handleMenuClick("/chat")} className="hover:text-yellow-400">Chat</button>
          <button onClick={() => handleMenuClick("/resources")} className="hover:text-yellow-400">Resource</button>
          {!isLoggedIn ? (
            <button
              onClick={() => router.push("/login")}
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => router.push("/account")}
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              Account
            </button>
          )}
        </div>
      </nav>

      <div className="pt-0">{children}</div>
    </>
  );
}
