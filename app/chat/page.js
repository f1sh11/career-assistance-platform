// app/chat/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContactSidebar from "../components/ContactSidebar";

export default function ChatPage() {
  const [targetUser, setTargetUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const targetId = searchParams.get("target");
  const API_URL = "http://localhost:5000";
  const textareaRef = useRef();
  const scrollRef = useRef();
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric"
    });
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    if (!targetId || !token) return;
    try {
      const res = await fetch(`${API_URL}/api/messages/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setComments(data);
      setTimeout(scrollToBottom, 100);
    } catch {
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (text = message, fileUrl = "", fileType = "") => {
    if (!targetId || (!text.trim() && !fileUrl)) return;
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: targetId,
          text,
          fileUrl,
          fileType
        })
      });
      if (res.ok) {
        const newMessage = await res.json();
        setComments(prev => [...prev, newMessage]);
        setMessage("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setTimeout(scrollToBottom, 0);
      }
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await fetch(`${API_URL}/api/upload/chat-file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!data.fileUrl) throw new Error("Upload failed");
      await sendMessage("", data.fileUrl, data.fileType);
      toast.success("File sent!");
    } catch {
      toast.error("Failed to upload");
    } finally {
      setShowUploadOptions(false);
      e.target.value = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isCurrentUser = (userId) =>
    userId === currentUser?._id || userId?._id === currentUser?._id;

const handleWithdraw = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/messages/withdraw/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 400) {
      const data = await res.json();
      toast.error(data.error || "Too late to withdraw");
      return;
    }
    if (res.ok) {
      setComments(prev =>
        prev.map(msg => msg._id === id
          ? { ...msg, isWithdrawn: true, text: "", fileUrl: "", fileType: "" }
          : msg
        )
      );
      toast.success("Message withdrawn");
    }
  } catch {
    toast.error("Failed to withdraw");
  }
};


  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setCurrentUser(data.user));
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/chat/list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setChatList(data));
    }
  }, [token]);

  useEffect(() => {
    if (token && targetId) {
      fetch(`${API_URL}/api/users/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setTargetUser(data));
    }
  }, [targetId, token]);

  useEffect(() => {
    if (targetId && currentUser) {
      setComments([]);
      fetchMessages();
    }
  }, [targetId, currentUser]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-[72px] relative">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`fixed top-[100px] ${collapsed ? 'left-[8px]' : 'left-[250px]'} z-50 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 transition`}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className="flex flex-1">
        <ContactSidebar
          chatList={chatList}
          targetId={targetId}
          onSelect={(id) => router.push(`/chat?target=${id}`)}
          collapsed={collapsed}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto px-6 py-4 transition-all duration-300 ease-in-out"
            ref={scrollRef}
            style={{ minHeight: 0, maxHeight: "calc(100vh - 160px)" }}
          >
            {comments.map((c, idx) => (
              <div
                key={idx}
                className={`flex items-start mb-4 ${isCurrentUser(c.senderId) ? "justify-end" : ""}`}
              >
                {!isCurrentUser(c.senderId) && (
                  <img
                    src={`${API_URL}${targetUser?.profile.avatarUrl || "/default-avatar.png"}`}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                )}
                <div className="max-w-xs group">
                  <div
                    className="bg-black text-white px-4 py-2 rounded-lg relative"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (isCurrentUser(c.senderId) && !c.isWithdrawn) {
                        if (window.confirm("Withdraw this message?")) {
                          handleWithdraw(c._id);
                        }
                      }
                    }}
                    onTouchStart={(e) => {
                      if (!isCurrentUser(c.senderId) || c.isWithdrawn) return;
                      const timeoutId = setTimeout(() => {
                        if (window.confirm("Withdraw this message?")) {
                          handleWithdraw(c._id);
                        }
                      }, 600);
                      const cancel = () => clearTimeout(timeoutId);
                      e.target.addEventListener("touchend", cancel, { once: true });
                      e.target.addEventListener("touchmove", cancel, { once: true });
                    }}
                  >
                    {c.isWithdrawn ? (
                      <p className="italic text-gray-400">This message was withdrawn</p>
                    ) : (
                      <>
                        {c.fileUrl ? (
                          c.fileType?.startsWith("image/") ? (
                            <img src={`${API_URL}${c.fileUrl}`} className="max-w-[240px] max-h-[160px] rounded" />
                          ) : (
                            <a href={`${API_URL}${c.fileUrl}`} download className="text-blue-400 underline hover:text-blue-600">📎 Download File</a>
                          )
                        ) : (
                          <p>{c.text}</p>
                        )}
                      </>
                    )}
                    <span className="text-xs text-gray-300 block mt-1">
                      {formatTime(c.createdAt)}
                    </span>
                  </div>
                </div>
                {isCurrentUser(c.senderId) && (
                  <img
                    src={`${API_URL}${currentUser?.profile.avatarUrl || "/default-avatar.png"}`}
                    className="w-10 h-10 rounded-full object-cover ml-3"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white px-4 py-3 flex items-end gap-4 border-t shrink-0">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded border border-gray-400 text-black resize-none overflow-y-auto max-h-[33vh] leading-snug"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, window.innerHeight / 3)}px`;
              }}
            />
            <button className="px-6 py-2 bg-black text-white rounded" onClick={() => sendMessage()}>
              Send
            </button>
          </div>
        </main>
      </div>

      <div className="fixed bottom-24 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowUploadOptions(!showUploadOptions)}
            className="w-12 h-12 rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-700 transition"
          >
            +
          </button>

          {showUploadOptions && (
            <div className="absolute bottom-14 right-0 bg-white shadow-md rounded p-2 space-y-2">
              <label className="block cursor-pointer text-sm text-black hover:text-blue-600">
                Upload File
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




