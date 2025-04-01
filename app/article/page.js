"use client";

import { useState } from "react";

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
    <div className="min-h-screen bg-fixed bg-cover bg-center px-8 py-24 text-black font-sans"
         style={{ backgroundImage: "url('/Curtin2.png')" }}>
      <div className="bg-white/90 rounded-lg max-w-4xl mx-auto p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2">How to Choose the Right Programming Language for You?</h1>
        <p className="text-sm text-gray-600 mb-6">Author: John Doe | Posted: Mar 26, 2025</p>

        <article className="mb-6 text-base leading-relaxed">
          <p>
            As a computer science student, I found myself confused about which programming language to focus on. Python is great for quick development, while Java is better for large-scale enterprise applications. If you're undecided, choose based on your career interests and goals.
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
            {comments.length === 0 && <p className="text-gray-500">No comments yet. Be the first to reply!</p>}
            {comments.map((c, idx) => (
              <div key={idx} className="bg-gray-100 p-4 rounded">
                <p className="text-sm">{c.text}</p>
                <p className="text-xs text-right text-gray-500">{c.time}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              placeholder="Leave your comment here..."
              rows={3}
            />
            <button onClick={handleCommentSubmit} className="self-end bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Submit Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
