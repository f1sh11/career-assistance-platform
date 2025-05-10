"use client";

import { useState, useRef } from "react";

export default function ChatPage() {
  const [activeSection, setActiveSection] = useState("private");
  const [showOptions, setShowOptions] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello, how are you?", from: "other" },
    { text: "I'm good, thanks!", from: "me" }
  ]);
  const textareaRef = useRef();

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? "" : section));
  };

  const handleSend = () => {
    const value = textareaRef.current.value.trim();
    if (!value) return;

    setMessages((prev) => [...prev, { text: value, from: "me" }]);
    textareaRef.current.value = "";
    textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-[72px] flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-48 h-screen rounded shadow flex flex-col overflow-y-auto bg-black text-white">
          <div
            className="bg-blue-500 px-4 py-4 cursor-pointer h-14 hover:text-gray-200"
            onClick={() => toggleSection("private")}
          >
            Private chat
          </div>
          <div className={activeSection === "private" ? "bg-gray-800" : "bg-gray-200"}>
            {activeSection === "private" &&
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center px-4 py-2 border-b border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-400 mr-3" />
                  <span className="text-sm text-white">Mentor {i + 1}</span>
                </div>
              ))}
          </div>

          <div
            className="bg-blue-500 px-4 py-4 cursor-pointer h-14 hover:text-gray-200"
            onClick={() => toggleSection("group")}
          >
            Group chat
          </div>
          <div className={activeSection === "group" ? "bg-gray-800" : "bg-gray-200"}>
            {activeSection === "group" &&
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center px-4 py-2 border-b border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-400 mr-3" />
                  <span className="text-sm text-white">Alumni {i + 1}</span>
                </div>
              ))}
          </div>

          <div className="mt-auto h-0 bg-gray-200 w-full shrink-0" />
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start ${msg.from === "me" ? "justify-end" : ""}`}
              >
                {msg.from !== "me" && (
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
                )}
                <div
                  className={`${
                    msg.from === "me" ? "bg-gray-900" : "bg-black"
                  } text-white px-4 py-2 rounded-lg ${
                    msg.from === "me" ? "rounded-br-none" : "rounded-bl-none"
                  } max-w-xs`}
                >
                  {msg.text}
                </div>
                {msg.from === "me" && (
                  <div className="w-10 h-10 rounded-full bg-gray-300 ml-3" />
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-black-200 px-4 py-3 flex items-end gap-4">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded border border-gray-400 text-black resize-none overflow-y-auto max-h-[33vh] leading-snug"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  window.innerHeight / 3
                )}px`;
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              className="px-6 py-2 bg-black text-white rounded"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
