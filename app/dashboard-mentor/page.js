"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardMentor() {
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
    if (userData.role !== "mentor") {
      router.replace("/login");
    } else {
      setUser(userData);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, []);

  return (
    <div className="p-10 text-center text-black">
      <h1 className="text-3xl font-bold">👨‍🏫 Welcome back, Mentor!</h1>
      <p className="text-lg mt-4">Here you can accept matching requests and engage with students.</p>
    </div>
  );
}

