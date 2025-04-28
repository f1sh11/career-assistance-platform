"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      const msg = localStorage.getItem("loginMessage");
      if (msg) {
        alert(msg);
        localStorage.removeItem("loginMessage");
      }
    }
  }, []);

  const handleMenuClick = (route) => {
    if (!isLoggedIn) {
      alert("You need to log in before accessing this feature.");
      router.push("/login");
    } else {
      router.push(route);
    }
  };

  if (isLoggedIn === null) return null; // 防止第一次加载闪烁

  return (
    <div className="max-w-screen overflow-x-hidden bg-black text-white font-sans relative">
      {/* Hero Section */}
      <section
        className="relative min-h-screen pt-28 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/Curtin1.jpg')" }}
      >
        <div className="bg-gradient-to-r from-black/80 to-transparent w-full max-w-screen-xl px-6 py-16 rounded text-white">
          <div className="text-left max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Curtin University Student
            </h2>
            <p className="text-lg sm:text-xl mt-4 font-light">
              Career Assistance Platform
            </p>

            {/* 🔥这里是改过的地方：只有未登录才显示 */}
            {!isLoggedIn && (
              <button
                onClick={() => handleMenuClick("/login")}
                className="mt-8 px-6 py-2 bg-yellow-400 text-black font-medium rounded shadow hover:bg-yellow-500 transition"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </section>

      {/* More Section */}
      <section className="px-6 md:px-12 py-24 bg-gray-900 text-white">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-center mb-16">
          More
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {["Connection", "Guidance", "Friendliness"].map((title, idx) => (
            <div
              key={idx}
              className="bg-white text-black rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition"
            >
              <Image
                src={`/${title}.jpg`}
                alt={title}
                width={600}
                height={300}
                className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105 hover:brightness-90"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">{title}</h3>
                <p className="text-base">
                  {title === "Connection" &&
                    "Develops a proper channel to link the students with the mentors, alumni and industry professional."}
                  {title === "Guidance" &&
                    "Through professional career counseling and skill development, provides students with clear directions and practical support."}
                  {title === "Friendliness" &&
                    "As an institution that embraces diversity and respect, create a friendly atmosphere for learners."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collaborators Section */}
      <div className="px-12 py-24 text-center">
        <h2 className="text-5xl font-light mb-8">Collaborators</h2>
        <div className="flex flex-wrap justify-center gap-12">
          <Image src="/MIS.jpg" alt="MIS" width={150} height={75} />
          <Image src="/SIMM.png" alt="SIMM" width={150} height={75} />
          <Image src="/DB.jpg" alt="University" width={150} height={75} />
          <Image src="/HF.jpg" alt="Institution" width={150} height={75} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12 text-center text-gray-400 text-base sm:text-lg">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Image
            src="/curtinlogo.png.png"
            alt="Curtin Singapore"
            width={36}
            height={36}
          />
          <p>&copy; {new Date().getFullYear()} Curtin Singapore. All rights reserved.</p>
        </div>
        <div className="mt-4 space-x-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}
