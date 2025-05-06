
/*dashboard*/
"use client";
import { useEffect } from "react";
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

      if (role === "student") {
        router.push("/dashboard-student");
      } else if (role === "mentor") {
        router.push("/dashboard-mentor");
      } else if (role === "industry") {
        router.push("/dashboard-industry");
      } else if (role === "admin") {
        router.push("/dashboard-admin");
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to parse user data:", err);
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black text-xl font-semibold">
      🎬 Redirecting to your dashboard...
    </div>
  );
}


