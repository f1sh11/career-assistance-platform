import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

export default function PostSomethingCard({ onPost, newPost, setNewPost }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`${
        isFullscreen
          ? "fixed top-0 left-0 w-full h-full z-50 bg-white pt-30 px-20 p-6 overflow-auto"
          : "bg-white shadow-md rounded p-4"
      }`}
    >
      {/* 顶部控制区 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Post Something</h2>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {/* 发布输入区域 */}
      <textarea
        className="w-full h-40 p-3 border rounded bg-gray-100 resize-none text-black mb-2"
        placeholder="What's on your mind?"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
      />

      <button
        onClick={onPost}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Post
      </button>
    </div>
  );
}
