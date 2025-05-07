"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirector() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      const role = user.role?.toLowerCase();

      // 显示 2 秒 loading 后自动跳转
      setTimeout(() => {
        if (role === "student") router.push("/dashboard-student");
        else if (role === "mentor") router.push("/dashboard-mentor");
        else if (role === "industry") router.push("/dashboard-industry");
        else if (role === "admin") router.push("/dashboard-admin");
        else router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Failed to parse user data:", err);
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-yellow-400 font-bold">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-6"></div>
      <p className="text-xl">Loading...</p>
    </div>
  );
}






