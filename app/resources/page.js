"use client";

import Image from "next/image";

export default function ResourcePage() {
  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/Curtin3.jpg')" }}>
      {/* ✅ 顶部导航栏 */}
      <nav className="w-full bg-black text-white fixed top-0 left-0 z-50 flex justify-between items-center px-12 py-4">
        <div className="flex items-center space-x-4">
          <Image src="/curtinlogo.png.png" alt="Curtin Singapore" width={50} height={50} />
          <h1 className="text-xl font-light">Curtin Singapore</h1>
        </div>
        <div className="space-x-8 text-lg">
          <a href="/" className="hover:text-yellow-400">Home</a>
          <a href="/community" className="hover:text-yellow-400">Community</a>
          <a href="/profile" className="hover:text-yellow-400">Profile</a>
          <a href="/chat" className="hover:text-yellow-400">Chat</a>
          <a href="/resources" className="hover:text-yellow-400">Resource</a>
        </div>
      </nav>

      {/* 页面内容整体下移，避免被顶部栏遮住 */}
      <div className="pt-[80px] flex">
        {/* 左侧导航栏 */}
        <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col cursor-pointer pt-24 space-y-6">
          <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Career Guides</div>
          <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Templates</div>
          <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">AI tool</div>
          <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Interview Preparation</div>
          <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Company Profiles</div>
          <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Skill Development Courses</div>
          <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Psychological Tests</div>
        </aside>

        {/* 右侧内容区域（暂时留空） */}
        <main className="ml-64 w-full max-w-4xl px-8 py-24 overflow-y-auto">
          {/* 留空区域：可添加资源展示内容 */}
        </main>
      </div>
    </div>
  );
}
