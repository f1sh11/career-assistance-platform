"use client";

import Image from "next/image";
import Link from "next/link";

export default function ReplyPage() {
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
      <div className="ml-48 flex-1 pt-32 flex flex-col items-center">
        {/* 顶部菜单栏 */}
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

        {/* 内容 */}
        <h1 className="text-5xl font-bold mb-12 text-black">My Replies</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2 text-black">Replied to: How to Choose a Language</h2>
            <p className="text-gray-700">"Agree! Python has great libraries for beginners."</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2 text-black">Replied to: Career Tips</h2>
            <p className="text-gray-700">"Thanks for the advice, it helped me a lot!"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

