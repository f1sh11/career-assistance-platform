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
  const [creatingPost, setCreatingPost] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);


  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    if (!postId && !hasRedirected && currentUser && targetUser && token) {
      const createPost = async () => {
        try {
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
          if (!post?._id) throw new Error("Post creation failed");

          setHasRedirected(true); // ✅ 防止死循环
          router.replace(`/chat?post=${post._id}&target=${targetId}`);
        } catch {
          toast.error("Failed to create chat post");
        }
      };

      createPost();
    }
  }, [postId, currentUser, targetUser, token, targetId, hasRedirected]);

  const fetchComments = async (pageToLoad = 1) => {
    if (!postId || !token || loading || (pageToLoad !== 1 && !hasMore)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/comments/${postId}?page=${pageToLoad}&limit=20`);
      const data = await res.json();
      if (!Array.isArray(data.comments)) throw new Error("Invalid comments data");
      if (pageToLoad === 1) {
        setComments(data.comments);
      } else {
        setComments(prev => [...data.comments, ...prev]);
      }
      setPage(pageToLoad);
      setHasMore(pageToLoad < (data.totalPages || 1));
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId && currentUser) {
      setComments([]);
      setPage(1);
      setHasMore(true);
      fetchComments(1);
      setTimeout(scrollToBottom, 100);
    }
  }, [postId, targetId, currentUser]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loading]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop < 100 && hasMore && !loading) {
      fetchComments(page + 1);
    }
  };

  const sendMessage = async () => {
    if (!postId || !message.trim()) return;
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
        setTimeout(scrollToBottom, 0);
      }
    } catch {
      toast.error("Failed to send message");
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
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isCurrentUser = (userId) => userId === currentUser?._id || userId?._id === currentUser?._id;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-[72px]">
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-60 bg-black text-white flex flex-col">
          <div className="bg-blue-500 px-4 py-4 font-semibold">Private Chats</div>
          {chatList.map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center px-4 py-2 hover:bg-gray-800 ${item.user._id === targetId ? "bg-gray-800" : ""}`}
              onClick={() => {
                if (targetId !== item.user._id) {
                  router.push(`/chat?post=${item.postId}&target=${item.user._id}`);
                }
              }}
            >
              <img
                src={`${API_URL}${item.user.profile.avatarUrl || "/default-avatar.png"}`}
                className="w-8 h-8 rounded-full object-cover mr-3"
              />
              <span className="text-sm">{item.user.profile.name}</span>
            </button>
          ))}
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto px-6 py-4 transition-all duration-300 ease-in-out"
            ref={scrollRef}
            style={{ minHeight: 0, maxHeight: "calc(100vh - 160px)" }}
          >
            {targetUser?.profile?.name && (
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
                    <span className="text-xs text-gray-300 block mt-1">
                      {formatTime(c.createdAt)}
                    </span>
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
            <button className="px-6 py-2 bg-black text-white rounded" onClick={sendMessage}>
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
