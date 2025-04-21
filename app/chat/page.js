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
    <div className="min-h-screen bg-gray-100">
      <div className="pt-[72px] flex h-screen overflow-hidden">
        {/* 左侧聊天栏 */}
        <aside className="w-48 h-screen rounded shadow flex flex-col overflow-y-auto bg-black text-white">
          {/* 私聊按钮 */}
          <div
            className="bg-blue-500 px-4 py-4 cursor-pointer h-14 hover:text-gray-200"
            onClick={() => toggleSection("private")}
          >
            Private chat
          </div>

          {/* 私聊列表 */}
          <div className={activeSection === "private" ? "bg-gray-800" : "bg-gray-200"}>
            {activeSection === "private" &&
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center px-4 py-2 border-b border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-400 mr-3" />
                  <span className="text-sm text-white">Name</span>
                </div>
              ))}
          </div>

          {/* 群聊按钮 */}
          <div
            className="bg-blue-500 px-4 py-4 cursor-pointer h-14 hover:text-gray-200"
            onClick={() => toggleSection("group")}
          >
            Group chat
          </div>

          {/* 群聊列表 */}
          <div className={activeSection === "group" ? "bg-gray-800" : "bg-gray-200"}>
            {activeSection === "group" &&
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center px-4 py-2 border-b border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-400 mr-3" />
                  <span className="text-sm text-white">Name</span>
                </div>
              ))}
          </div>

          {/* 底部灰色背景块 */}
          <div className="mt-auto h-0 bg-gray-200 w-full shrink-0" />
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
          <div className="bg-black-200 px-4 py-3 flex items-end gap-4">
            <textarea
              rows={1}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded border border-gray-400 text-black resize-none overflow-y-auto max-h-[33vh] leading-snug"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, window.innerHeight / 3)}px`;
              }}
            />
            <button className="px-6 py-2 bg-black text-white rounded">Send</button>
          </div>

          {/* 展开按钮组 */}
          {showOptions && (
            <div className="absolute bottom-36 right-6 flex flex-col space-y-3 items-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Send File</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Send Image</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Send Video</button>
            </div>
          )}

          {/* 加号按钮 */}
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




            
   
