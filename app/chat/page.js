"use client";

import Image from "next/image";
import { useState } from "react";

export default function ChatPage() {
  const [activeSection, setActiveSection] = useState("private");
  const [showOptions, setShowOptions] = useState(false);

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-[80px]">
      {/* 顶部导航栏已全局引入，无需重复 */}

      <div className="flex h-screen overflow-hidden">
        {/* 左侧聊天栏 */}
        <aside className="w-48 h-screen rounded shadow bg-black text-white flex flex-col">
          <div
            className="bg-blue-500 px-4 py-4 cursor-pointer hover:text-grey rounded shadow"
            onClick={() => toggleSection("private")}
          >
            Private chat
          </div>
          {activeSection === "private" && (
            <div className="flex-1 bg-gray-800">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center px-4 py-2 border-b border-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-400 mr-3" />
                  <span className="text-sm">Name</span>
                </div>
              ))}
            </div>
          )}
          <div
            className="bg-blue-500 px-4 py-4 cursor-pointer hover:text-grey rounded shadow"
            onClick={() => toggleSection("group")}
          >
            Group chat
          </div>
          {activeSection === "group" && (
            <div className="flex-1 bg-gray-800">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center px-4 py-2 border-b border-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-400 mr-3" />
                  <span className="text-sm">Name</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* 主聊天区域 */}
        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
              <div className="bg-black text-white px-4 py-2 rounded-lg rounded-bl-none max-w-xs">
                Hello, how are you?
              </div>
            </div>
            <div className="flex items-start justify-end">
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg rounded-br-none max-w-xs">
                I'm good, thanks!
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-300 ml-3" />
            </div>
          </div>

          {/* 输入栏 */}
          <div className="bg-black-200 px-4 py-3 flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded border border-gray-400 text-black"
            />
            <button className="ml-4 px-6 py-2 bg-black text-white rounded">Send</button>
          </div>

          {/* 展开按钮组 */}
          {showOptions && (
            <div className="absolute bottom-36 right-6 flex flex-col space-y-3 items-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Send File</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Send Image</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Send Video</button>
            </div>
          )}

          {/* 右下角加号按钮 */}
          <button
            className="absolute bottom-20 right-6 w-12 h-12 bg-blue-500 text-white rounded-full text-2xl"
            onClick={() => setShowOptions(!showOptions)}
          >
            +
          </button>
        </main>
      </div>
    </div>
  );
}
