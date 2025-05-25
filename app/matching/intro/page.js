"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function MatchingIntroPage() {
  const [profileReady, setProfileReady] = useState(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const checkProfile = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const profile = data.user?.profile || {};

        const isComplete =
          profile.name &&
          profile.email &&
          profile.major &&
          profile.introduction;

        setProfileReady(!!isComplete);
      } catch (error) {
        toast.error("Failed to check profile.");
        setProfileReady(false);
      }
    };

    checkProfile();
  }, []);

  if (profileReady === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-lg">Loading, please wait...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div
        className="w-full md:w-1/2 bg-cover h-64 md:h-auto"
        style={{
          backgroundImage: "url('/Curtin4.jpg')",
          backgroundPosition: "80% center"
        }}
      ></div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="space-y-10 max-w-xl text-left">
          <h1 className="text-3xl md:text-4xl font-semibold text-black">
            {profileReady
              ? "You’ve successfully completed your profile. Click Start to begin matching."
              : "Your profile is incomplete. Please fill it before starting matching."}
          </h1>
          <div className="text-right">
            <button
              className="text-xl px-10 py-4 bg-black text-yellow-400 font-semibold rounded hover:opacity-90 transition"
              onClick={() =>
                profileReady ? router.push("/matching") : router.push("/profile")
              }
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


