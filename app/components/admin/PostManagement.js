"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPostManagementPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      setExpandedPost(null);
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpandedPostId(postId);
      setExpandedPost(res.data);
    } catch (err) {
      console.error("Failed to fetch full post", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
      if (expandedPostId === id) {
        setExpandedPostId(null);
        setExpandedPost(null);
      }
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10 text-black">
      <h1 className="text-3xl font-bold mb-6">📝 Post Management</h1>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                Author: {post.authorName || "Unknown"}
              </p>
              <p className="text-gray-700 mb-3 whitespace-pre-line">
                {(post.content || "").slice(0, 100)}...
              </p>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleExpand(post._id)}
                  className="text-blue-500 hover:underline"
                >
                  {expandedPostId === post._id ? "Hide Details" : "View Full Post"}
                </button>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>

              {expandedPostId === post._id && expandedPost && (
                <div className="mt-6 border-t pt-4 text-black whitespace-pre-line bg-gray-50 rounded p-4">
                  <h3 className="text-lg font-semibold mb-2">Full Content</h3>
                  <p className="mb-4">{expandedPost.content}</p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(expandedPost.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


