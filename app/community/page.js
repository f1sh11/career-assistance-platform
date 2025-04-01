"use client";

import Image from "next/image";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/Curtin2.jpg')" }}>
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
        {/* 左侧固定导航栏 */}
        <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col cursor-pointer pt-24 space-y-6">
          <div className="text-lg font-light cursor-pointer hover:text-yellow-400 px-4 py-2 rounded shadow">Collect</div>
          <div className="text-lg font-light cursor-pointer hover:text-yellow-400 px-4 py-2 rounded shadow">Comment</div>
          <div className="text-lg font-light cursor-pointer hover:text-yellow-400 px-4 py-2 rounded shadow">Reply</div>
        </aside>

        {/* 右侧可滚动内容 */}
        <main className="ml-48 w-full max-w-4xl px-8 py-24 overflow-y-auto">
          {/* 示例文章列表 */}
          <Link href="/community/article/1">
            <div className="cursor-pointer bg-white/90 rounded-lg shadow-md p-6 mb-6 hover:shadow-xl transition">
              <h2 className="text-2xl font-semibold mb-2 text-black">“How to Choose the Right Programming Language for You?”</h2>
              <p className="text-gray-700 text-sm">
                “As a computer science student, I found myself confused about which programming language to focus on...”
              </p>
            </div>
          </Link>

          <Link href="/community/article/2">
            <div className="cursor-pointer bg-white/90 rounded-lg shadow-md p-6 mb-6 hover:shadow-xl transition">
              <h2 className="text-2xl font-semibold mb-2 text-black">“The Most Difficult Algorithm Question I Encountered...”</h2>
              <p className="text-gray-700 text-sm">
                “During one of my interviews, I was given a very challenging algorithm question...”
              </p>
            </div>
          </Link>

          <Link href="/community/article/3">
            <div className="cursor-pointer bg-white/90 rounded-lg shadow-md p-6 mb-6 hover:shadow-xl transition">
              <h2 className="text-2xl font-semibold mb-2 text-black">“How to Build a Personal Brand on Social Media Platforms?”</h2>
              <p className="text-gray-700 text-sm">
                “Social media has become a major content publishing platform...”
              </p>
            </div>
          </Link>
        </main>
      </div>
    </div>
  );
}
