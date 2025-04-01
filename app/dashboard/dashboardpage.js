
/*dashboard*/
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 标记组件已挂载（确保 localStorage 可用）
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const token = typeof window !== "undefined" && localStorage.getItem("token");

    console.log("🧪 Token in dashboard:", token);

    if (!token) {
      console.log("🔁 No token, going back to login...");
      router.replace("/login");
    } else {
      // 模拟用户数据
      const user = { role: "student" };
      localStorage.setItem("loginMessage", `Welcome back, ${user.role}!`);

      console.log("✅ Token found, navigating to home soon...");
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    }
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center space-y-6">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-yellow-500 border-opacity-50 mx-auto"></div>
        <h1 className="text-3xl md:text-4xl font-light text-yellow-500">Loading dashboard...</h1>
        <p className="text-gray-400">Preparing your profile...</p>
      </div>
    </div>
  );
}
