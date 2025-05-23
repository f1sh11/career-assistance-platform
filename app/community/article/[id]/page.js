"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import CommunitySidebar from "../../../components/CommunitySidebar";



const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ArticlePage({ params }) {
const { id: articleId } = use(params);

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [collected, setCollected] = useState(false);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${API}/api/posts/${articleId}`);
      setPost(res.data);
      setLikes(res.data.likes.length);
      setCollected(res.data.collectedBy.includes(getUserId()));
    } catch (err) {
      console.error("Failed to load article", err);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await axios.get(`${API}/api/comments/${articleId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const getUserId = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (err) {
      return null;
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.put(`${API}/api/posts/${articleId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikes(res.data.likes);
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  const handleCollect = async () => {
    try {
      const res = await axios.put(`${API}/api/posts/${articleId}/collect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollected(res.data.collected);
    } catch (err) {
      console.error("Failed to collect post", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!input.trim()) return;
    try {
      await axios.post(`${API}/api/comments/${articleId}`, {
        text: input,
        targetUserId: post?.authorId?._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInput("");
      fetchComments();
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchPost();
      fetchComments();
    }
  }, [articleId]);

  if (!post) return <p className="text-white p-10">Loading article...</p>;

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/Curtin2.jpg')" }}>
      <div className="flex">
       <CommunitySidebar showReturn={true} />


        <main className="ml-48 w-full max-w-4xl px-8 py-24 overflow-y-auto text-black">
          <div className="bg-white/90 rounded-lg mx-auto p-8 shadow-md">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
              <img
                src={post.isAnonymous ? "/default-avatar.png" : post.authorAvatarUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <span>
                {post.isAnonymous ? "Anonymous User" : post.authorName || "Unknown"} | Posted: {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>

            <article className="mb-6 text-base leading-relaxed">
              <p>{post.content}</p>
            </article>

            <div className="flex items-center space-x-6 mb-6">
              <button onClick={handleLike} className="text-blue-600 hover:underline">
                👍 Like ({likes})
              </button>
              <button onClick={handleCollect} className="text-yellow-500 hover:underline">
                {collected ? "★ Collected" : "☆ Collect"}
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>
              {loadingComments ? (
                <p className="text-gray-600">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-gray-700">No comments yet. Be the first to reply!</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {Array.isArray(comments) && comments.map((c, idx) => (
  <div key={idx} className="bg-gray-100 p-4 rounded text-black">
    <p className="text-sm">{c.text}</p>
    <p className="text-xs text-right text-gray-500">
      {c.userId?.username || "User"} @ {new Date(c.createdAt).toLocaleString()}
    </p>
  </div>
))}
                </div>
              )}

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