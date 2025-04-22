"use client";

import Image from "next/image";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/Curtin2.jpg')" }}>
      <div className="pt-[80px] flex">
        {/* 左侧固定导航栏 */}
        <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col cursor-pointer pt-24 space-y-6">
          <Link href="/community/collect">
            <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Collect</div>
          </Link>
          <Link href="/community/comment">
            <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Comment</div>
          </Link>
          <Link href="/community/reply">
            <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Reply</div>
          </Link>
        </aside>

        {/* 中间文章和右侧栏整体 */}
        <div className="ml-48 flex flex-1 px-8 py-10 space-x-8">
          {/* 中间滚动文章列表 */}
          <main className="flex-1 overflow-y-auto">
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

          {/* 右侧个人资料+发布 */}
          <aside className="w-80 flex flex-col space-y-8">
            {/* 个人信息卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div className="rounded-full w-24 h-24 bg-gray-300 border-4 border-white shadow-md mb-4 overflow-hidden"></div>
              <h2 className="text-2xl font-light mb-2 text-black">Name</h2>
              <p className="text-gray-700 text-center">This is your self-introduction syncing from Profile page...</p>
            </div>

            {/* 发布区域 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-black mb-4">Post Something</h2>
              <textarea
                className="w-full h-32 p-4 border rounded-md bg-gray-100 resize-none mb-4"
                placeholder="What's on your mind?"
              ></textarea>
              <button className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition">
                Post
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


