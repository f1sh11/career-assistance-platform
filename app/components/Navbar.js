"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const hideNav = pathname === "/dashboard-admin";



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  if (loading) {
    return null; // ❌ 问题在这！
  }

  const handleMenuClick = (route) => {
    if (!user && route !== "/login") {
      alert("You need to log in before accessing this feature.");
      router.push("/login");
    } else {
      router.push(route);
      setDropdownOpen(false);
    }
  };

  const baseMenu = [{ label: "Home", route: "/" }];
  const adminMenu = [{ label: "Admin Panel", route: "/dashboard-admin/console" }];
  const userMenu = [
    { label: "Community", route: "/community" },
    { label: "Resource", route: "/resource" },
    { label: "Matching", route: "/matching/intro" },
  ];
  const navMenu = user?.role === "admin" ? [...baseMenu, ...adminMenu] : [...baseMenu, ...userMenu];

  return (
    <>
      <nav className="w-full bg-black/80 backdrop-blur-md text-white fixed top-0 left-0 z-10000 shadow-md">
        <div className="flex items-center justify-between w-full px-6 py-4">
          <div
            className="flex items-center space-x-2 cursor-pointer"
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

          {!hideNav && (
            <div className="flex items-center space-x-4 text-sm sm:text-base relative">
              {navMenu.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleMenuClick(item.route)}
                  className="hover:text-yellow-400 hover:underline underline-offset-4 transition"
                >
                  {item.label}
                </button>
              ))}

              {user === undefined ? null : !user ? (
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
                    <div className="absolute right-0 top-full mt-2 w-52 bg-black/80 rounded-lg shadow-lg z-[10000] overflow-hidden backdrop-blur-md">
                      {[{ label: "Account Overview", route: "/account" }, { label: "Settings", route: "/account/settings" }, { label: "Profile", route: "/profile" }, { label: "Activity", route: "/account/activity" }, { label: "Notifications", route: "/account/notifications" }, { label: "Security", route: "/account/security" }, { label: "Logout", route: "/login", isLogout: true }].map((item, index) => {
                        const isLogout = item.isLogout;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              if (isLogout) {
                                setDropdownOpen(false);
                                logout();
                                sessionStorage.removeItem("token");
                                sessionStorage.removeItem("user");
                                router.push("/login").then(() => {
                                  window.location.reload(); // ✅ 完整清理所有状态
                                });
                              } else {
                                handleMenuClick(item.route);
                              }
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition relative group ${
                              isLogout
                                ? "text-white hover:text-red-600 hover:bg-white"
                                : "text-white group-hover:text-black"
                            }`}
                          >
                            <span className="relative z-10">{item.label}</span>
                            {!isLogout && (
                              <span className="absolute inset-x-0 bottom-0 h-1 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <div className="h-[0px]" />
    </>
  );
}

