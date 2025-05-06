"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardIndustry() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.replace("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData.role !== "industry") {
      router.replace("/login");
    } else {
      setUser(userData);
    }
  }, []);

  return (
    <div className="p-10 text-center text-black">
      <h1 className="text-3xl font-bold">🏢 Welcome back, Industry Professional!</h1>
      <p className="text-lg mt-4">You may upload helpful career resources and connect with students.</p>
    </div>
  );
}
