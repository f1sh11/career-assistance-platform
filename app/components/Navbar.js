"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (route) => {
    if (!isLoggedIn && route !== "/login") {
      alert("You need to log in before accessing this feature.");
      router.push("/login");
    } else {
      router.push(route);
      setDropdownOpen(false);
    }
  };

  return (
    <nav className="w-full bg-black/80 backdrop-blur-md text-white fixed top-0 left-0 z-50 px-4 py-4 shadow-md">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
        {/* Logo */}
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

        {/* Menu */}
        <div className="flex flex-wrap justify-end gap-3 sm:gap-4 text-sm sm:text-base items-center relative">
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

          {!isLoggedIn ? (
            <button
              onClick={() => router.push("/login")}
              className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Account
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => handleMenuClick("/account")}
                    className="block w-full text-left px-4 py-2 hover:bg-yellow-100"
                  >
                    Account Overview
                  </button>
                  <button
                    onClick={() => handleMenuClick("/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-yellow-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleMenuClick("/settings")}
                    className="block w-full text-left px-4 py-2 hover:bg-yellow-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => handleMenuClick("/activity")}
                    className="block w-full text-left px-4 py-2 hover:bg-yellow-100"
                  >
                    Activity
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("username");
                      router.push("/login");
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

