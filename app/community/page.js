"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newPost, setNewPost] = useState("");

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/posts?page=${page}`);
      if (res.data.length < 15) setHasMore(false);
      setPosts((prev) => [...prev, ...res.data]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API}/api/posts`,
        { title: newPost.slice(0, 50), content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([res.data, ...posts]);
      setNewPost("");
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        fetchPosts();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/Curtin2.jpg')" }}>
      <div className="pt-[80px] flex">
        <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col cursor-pointer pt-24 space-y-6">
          <Link href="/community/collect"><div className="hover:text-yellow-400 px-4 py-2 rounded">Collect</div></Link>
          <Link href="/community/comment"><div className="hover:text-yellow-400 px-4 py-2 rounded">Comment</div></Link>
          <Link href="/community/reply"><div className="hover:text-yellow-400 px-4 py-2 rounded">Reply</div></Link>
        </aside>

        <div className="ml-48 flex flex-1 px-8 py-10 space-x-8">
          {/* Posts */}
          <main className="flex-1 overflow-y-auto">
            {posts.map((post, idx) => (
              <Link href={`/community/article/${post._id}`} key={idx}>
                <div className="bg-white/90 rounded-lg shadow-md p-6 mb-6 hover:shadow-xl transition cursor-pointer">
                  <h2 className="text-2xl font-semibold mb-2 text-black">{post.title}</h2>
                  <p className="text-gray-700 text-sm">{post.content.slice(0, 100)}...</p>
                  {post.status === "pending" && <p className="text-red-500 text-xs mt-2">Pending Review</p>}
                </div>
              </Link>
            ))}
            {loading && <p className="text-white text-center">Loading...</p>}
            {!hasMore && <p className="text-white text-center">No more posts</p>}
          </main>

          {/* Sidebar */}
          <aside className="w-80 flex flex-col space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-black">
              <h2 className="text-xl font-semibold mb-4">Post Something</h2>
              <textarea
                className="w-full h-32 p-4 border rounded-md bg-gray-100 resize-none mb-4"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <button onClick={handlePost} className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600">
                Post
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}






