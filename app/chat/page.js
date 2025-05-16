"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ChatPage() {
  const [targetUser, setTargetUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetId = searchParams.get("target");
  const postId = searchParams.get("post");
  const API_URL = "http://localhost:5000";
  const textareaRef = useRef();
  const scrollRef = useRef();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
    if (!postId && currentUser && targetUser && token) {
      const createPost = async () => {
        const res = await fetch(`${API_URL}/api/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: `Chat between ${currentUser.profile.name} and ${targetUser.profile.name}`,
            content: "Private conversation.",
            isAnonymous: true
          })
        });
        const post = await res.json();
        router.push(`/chat?post=${post._id}&target=${targetId}`);
      };
      createPost();
    }
  }, [postId, currentUser, targetUser, token]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId || !token) return;

      const res = await fetch(`${API_URL}/api/comments/${postId}`);
      const data = await res.json();
      setComments(data);

      if (data.length === 0 && currentUser?.profile) {
        const p = currentUser.profile;
        const intro = `Hi, I'm ${p.name || "a student"}. My major is ${p.major || "N/A"}, I'm skilled in ${p.skills || "N/A"}, interested in ${p.interests || "N/A"}, and my dream job is ${p.dreamJob || "N/A"}. Looking forward to learning from you!`;

        try {
          await fetch(`${API_URL}/api/comments/${postId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ text: intro })
          });

          const newRes = await fetch(`${API_URL}/api/comments/${postId}`);
          const newComments = await newRes.json();
          setComments(newComments);
        } catch (err) {
          console.warn("Intro message failed:", err.message);
        }
      }
    };

    if (currentUser && postId) fetchComments();
  }, [postId, token, currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: message })
      });
      if (res.ok) {
        setMessage("");
        const newComment = await res.json();
        setComments(prev => [...prev, newComment]);
        if (textareaRef.current) textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteMessage = async (commentId) => {
    try {
      const res = await fetch(`${API_URL}/api/comments/delete/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      }
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const isCurrentUser = (userId) => {
    return userId === currentUser?._id || userId?._id === currentUser?._id;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-[72px]">
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-60 bg-black text-white flex flex-col">
          <div className="bg-blue-500 px-4 py-4 font-semibold">Private Chats</div>

          {targetUser && (
            <div className="flex items-center px-4 py-2 border-b border-gray-700 bg-gray-800">
              <img
                src={`${API_URL}${targetUser.profile.avatarUrl || "/default-avatar.png"}`}
                className="w-8 h-8 rounded-full object-cover mr-3"
              />
              <span className="text-sm">{targetUser.profile.name}</span>
            </div>
          )}
          
          {chatList.map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center px-4 py-2 hover:bg-gray-800 ${item.user._id === targetId ? "bg-gray-800" : ""}`}
              onClick={() => router.push(`/chat?post=${item.postId}&target=${item.user._id}`)}
            >
              <img
                src={`${API_URL}${item.user.profile.avatarUrl || "/default-avatar.png"}`}
                className="w-8 h-8 rounded-full object-cover mr-3"
              />
              <span className="text-sm">{item.user.profile.name}</span>
            </button>
          ))}
        </aside>

        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
            {targetUser && (
              <div className="text-black font-semibold mb-4">
                Chatting with {targetUser.profile.name}
              </div>
            )}

            {comments.map((c, idx) => (
              <div
                key={idx}
                className={`flex items-start mb-4 ${isCurrentUser(c.userId) ? "justify-end" : ""}`}
              >
                {!isCurrentUser(c.userId) && (
                  <img
                    src={`${API_URL}${targetUser?.profile.avatarUrl || "/default-avatar.png"}`}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                )}
                <div className="max-w-xs group">
                  <div className="bg-black text-white px-4 py-2 rounded-lg relative">
                    <p>{c.text}</p>
                    <span className="text-xs text-gray-300 block mt-1">{formatTime(c.createdAt)}</span>
                    {isCurrentUser(c.userId) && (
                      <button
                        onClick={() => deleteMessage(c._id)}
                        className="absolute top-1 right-1 text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                {isCurrentUser(c.userId) && (
                  <img
                    src={`${API_URL}${currentUser?.profile.avatarUrl || "/default-avatar.png"}`}
                    className="w-10 h-10 rounded-full object-cover ml-3"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white px-4 py-3 flex items-end gap-4 border-t">
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
            <button className="px-6 py-2 bg-black text-white rounded" onClick={sendMessage}>
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
