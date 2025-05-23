"use client";

import { useRouter } from "next/navigation";

export default function MatchingIntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      {/* Left sidebar with only Back button */}
      <aside className="w-48 bg-gray-800 text-white fixed top-0 left-0 h-screen z-40 flex flex-col pt-24">
        <button
          onClick={() => router.push("/resource")}
          className="text-lg font-semibold px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-md mx-4"
        >
          ← Back
        </button>
      </aside>

      {/* Right content area */}
      <div className="flex-1 md:ml-48 flex flex-col md:flex-row">
        {/* Left: Image Background */}
        <div
          className="w-full md:w-1/2 bg-cover h-64 md:h-auto"
          style={{
            backgroundImage: "url('/Mbti.jpg')",
            backgroundPosition: "center center"
          }}
        ></div>

        {/* Right: Text and Start Button */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <div className="space-y-10 max-w-xl text-left">
            <h1 className="text-3xl md:text-4xl font-semibold text-black">
              Test your personality to help you find a suitable career!
            </h1>
            <div className="text-right">
              <button
                className="text-xl px-10 py-4 bg-black text-yellow-400 font-semibold rounded hover:opacity-90 active:scale-95 active:shadow-inner transition transform duration-100"
                onClick={() => {
                  const token = sessionStorage.getItem("token");
                  if (token) {
                    window.open(`http://localhost:3001/test?token=${token}`, "_blank");
                  } else {
                    alert("请先登录以生成 token");
                  }
                }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
