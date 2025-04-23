"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [search, setSearch] = useState("");

  const fetchPosts = async (pageToFetch = 1, limit = 3, keyword = "") => {
    try {
      const res = await axios.get(`${API}/api/posts?page=${pageToFetch}&limit=${limit}&search=${keyword}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
      setPage(pageToFetch);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    fetchPosts(1, 3);
  }, []);

  const handleMoreClick = () => {
    setShowAll(true);
    fetchPosts(1, 15, search);
  };

  const goToPage = (pageNum) => {
    fetchPosts(pageNum, 15, search);
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API}/api/posts`,
        { title: newPost.slice(0, 50), content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost("");
      // ✅ 新增逻辑：重新获取列表，控制在显示范围
      if (showAll) {
        fetchPosts(1, 15, search);
      } else {
        fetchPosts(1, 3, search);
      }
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const handleSearch = () => {
    setShowAll(true);
    fetchPosts(1, 15, search);
  };

  const shouldShowPagination = showAll && totalPages > 1 && posts.length >= 15;

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/Curtin2.jpg')" }}>
    
      <div className="pt-[100px] flex justify-center">
        <div className="fixed z-50 bg-white p-4 rounded shadow-md w-full max-w-7xl flex space-x-4 ml-13">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for posts..."
            className="flex-1 px-4 py-2 border rounded text-black"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex">
        <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col cursor-pointer pt-24 space-y-6">
          <Link href="/community/collect"><div className="hover:text-yellow-400 px-4 py-2 rounded">Collect</div></Link>
          <Link href="/community/comment"><div className="hover:text-yellow-400 px-4 py-2 rounded">Comment</div></Link>
          <Link href="/community/reply"><div className="hover:text-yellow-400 px-4 py-2 rounded">Reply</div></Link>
        </aside>

        <div className="ml-48 flex flex-1 px-8 py-10 space-x-8">
          <main className="flex-1 overflow-y-auto pt-[80px] pb-[160px]">
            {posts.map((post) => (
              <Link href={`/community/article/${post._id}`} key={post._id}>
                <div className="bg-white/90 rounded-lg shadow-md p-6 mb-6 hover:shadow-xl transition cursor-pointer">
                  <h2 className="text-2xl font-semibold mb-2 text-black">{post.title}</h2>
                  <p className="text-gray-700 text-sm">{post.content.slice(0, 100)}...</p>
                  {post.status === "pending" && <p className="text-red-500 text-xs mt-2">Pending Review</p>}
                </div>
              </Link>
            ))}

            {!showAll && totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleMoreClick}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded"
                >
                  Show More
                </button>
              </div>
            )}

            {shouldShowPagination && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button onClick={() => goToPage(1)} className="px-3 py-1 bg-gray-200 rounded">First</button>
                  <button disabled={page === 1} onClick={() => goToPage(page - 1)} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        page === i + 1 ? "bg-yellow-400 text-black" : "bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button disabled={page === totalPages} onClick={() => goToPage(page + 1)} className="px-3 py-1 bg-gray-200 rounded">Next</button>
                  <button onClick={() => goToPage(totalPages)} className="px-3 py-1 bg-gray-200 rounded">Last</button>
                </div>
              </div>
            )}
          </main>

          <aside className="w-80 flex flex-col space-y-8">
            <div className="fixed up-20 bottom-118 right-5 w-80 bg-white shadow-md p-6 text-black z-50 rounded">
              <h2 className="text-xl font-semibold mb-4">Post Something</h2>
              <textarea
                className="w-full h-24 p-3 border rounded bg-gray-100 resize-none mb-2"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <button
                onClick={handlePost}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}



















