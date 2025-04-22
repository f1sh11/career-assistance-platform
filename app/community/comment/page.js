"use client";

import Image from "next/image";
import Link from "next/link";

export default function CommentPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 左侧导航栏 */}
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
        <Link href="/community">
          <div className="text-lg font-light hover:text-yellow-400 px-4 py-2 rounded shadow">Return</div>
        </Link>
      </aside>

      {/* 主内容区 */}
      <div className="ml-48 flex-1 pt-[100px] flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-12 text-black">My Comments</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2 text-black">Commented on: How to Choose a Language</h2>
            <p className="text-gray-700">"I personally prefer Python for beginners because..."</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2 text-black">Commented on: Career Tips</h2>
            <p className="text-gray-700">"Networking is key. Always attend events and meet people!"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
