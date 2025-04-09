"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ArticlePage() {
  const [likes, setLikes] = useState(0);
  const [collected, setCollected] = useState(false);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");

  const handleCommentSubmit = () => {
    if (input.trim() !== "") {
      setComments([...comments, { text: input, time: new Date().toLocaleString() }]);
      setInput("");
    }
  };

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

      <div className="pt-[80px] flex">
        {/* 左侧固定导航栏 */}
        <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col cursor-pointer pt-24 space-y-6">
          <div className="text-lg font-light cursor-pointer hover:text-yellow-400 px-4 py-2 rounded shadow">Collect</div>
          <div className="text-lg font-light cursor-pointer hover:text-yellow-400 px-4 py-2 rounded shadow">Comment</div>
          <div className="text-lg font-light cursor-pointer hover:text-yellow-400 px-4 py-2 rounded shadow">Reply</div>
        </aside>

        {/* 主体内容区域 */}
        <main className="ml-48 w-full max-w-4xl px-8 py-24 overflow-y-auto text-black">
  <div className="bg-white/90 rounded-lg mx-auto p-8 shadow-md">
    <h1 className="text-3xl font-bold mb-2">How to Choose the Right Programming Language for You?</h1>
    <p className="text-sm text-gray-600 mb-6">Author: John Doe | Posted: Mar 26, 2025</p>

    <article className="mb-6 text-base leading-relaxed">
      <p>
        As a computer science student, I found myself confused about which programming language to focus on.
        Python is great for quick development, while Java is better for large-scale enterprise applications.
        If you're undecided, choose based on your career interests and goals.
      </p>
    </article>

    {/* 操作区：点赞 收藏 */}
    <div className="flex items-center space-x-6 mb-6">
      <button onClick={() => setLikes(likes + 1)} className="text-blue-600 hover:underline">
        👍 Like ({likes})
      </button>
      <button onClick={() => setCollected(!collected)} className="text-yellow-500 hover:underline">
        {collected ? "★ Collected" : "☆ Collect"}
      </button>
    </div>

    {/* 评论区 */}
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="space-y-4 mb-6">
        {comments.length === 0 && <p className="text-gray-700">No comments yet. Be the first to reply!</p>}
        {comments.map((c, idx) => (
          <div key={idx} className="bg-gray-100 p-4 rounded text-black">
            <p className="text-sm">{c.text}</p>
            <p className="text-xs text-right text-gray-500">{c.time}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border rounded p-2 text-sm text-black"
          placeholder="Leave your comment here..."
          rows={3}
        />
        <button onClick={handleCommentSubmit} className="self-end bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit Reply
        </button>
      </div>
    </div>
  </div>
</main>

      </div>
    </div>
  );
}

