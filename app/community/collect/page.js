"use client";

import Image from "next/image";
import Link from "next/link";

export default function CollectPage() {
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
        <h1 className="text-5xl font-bold mb-12 text-black">My Collections</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-2 text-black">Collected Article 1</h2>
            <p className="text-gray-700">This is a brief summary of the collected article...</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-2 text-black">Collected Article 2</h2>
            <p className="text-gray-700">Another article you have collected...</p>
          </div>
        </div>
      </div>
    </div>
  );
}


