// /app/community/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";
import axios from "axios";
import Link from "next/link";
import CommunitySidebar from "../components/CommunitySidebar";


const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function PostCard({ post, index, lastIndex, keyword }) {
  const highlight = (text, keyword) =>
    keyword
      ? text.replace(
          new RegExp(`(${keyword})`, "gi"),
          '<mark class="bg-yellow-200">$1</mark>'
        )
      : text;

  return (
    <div className="transition-all duration-300">
      <Link href={`/community/article/${post._id}`}>
        <div className="bg-white/90 rounded-lg shadow-md p-6 mb-6 hover:shadow-xl transition cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={post.isAnonymous ? "/default-avatar.png" : post.authorAvatarUrl || "/default-avatar.png"}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-700">
              {post.isAnonymous ? "Anonymous User" : post.authorName || "Unnamed"}
            </span>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-black">{post.title}</h2>
          <p
            className="text-gray-700 text-sm"
            dangerouslySetInnerHTML={{ __html: highlight(post.content.slice(0, 100), keyword) }}
          />
          {post.status === "pending" && (
            <p className="text-red-500 text-xs mt-2">Pending Review</p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState("keyword");
  const [userInfo, setUserInfo] = useState({ username: "", avatarUrl: "", anonymous: false });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        setUserInfo({
          username: user.identifier || "User",
          avatarUrl: `${API}${user.profile.avatarUrl}` || "/default-avatar.png",
          anonymous: false,
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

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
    const keywordFromURL = searchParams.get("search") || "";
    setSearch(keywordFromURL);
    fetchPosts(1, showAll ? 15 : 3, keywordFromURL);
  }, []);

  const debouncedSearch = useRef(
    debounce((value) => {
      setShowAll(true);
      router.push(`?search=${encodeURIComponent(value)}`);
      fetchPosts(1, 15, value);
    }, 600)
  ).current;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleSearch = () => {
    debouncedSearch.cancel();
    setShowAll(true);
    router.push(`?search=${encodeURIComponent(search)}`);
    fetchPosts(1, 15, search);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
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
        { title: newPost.slice(0, 50), content: newPost, isAnonymous: userInfo.anonymous },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost("");
      fetchPosts(1, showAll ? 15 : 3, search);
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const shouldShowPagination = showAll && totalPages > 1;

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/Curtin2.jpg')" }}>
      <div className="flex">
        {/* 左侧菜单栏 */}
        <CommunitySidebar showReturn={false} />

        <div className="ml-48 flex-1 px-8 pt-[100px] pb-24">
          {/* 搜索栏 */}
          <div className="bg-white p-4 rounded shadow-md w-full max-w-5xl mb-8 mx-auto flex space-x-4">
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
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

          <div className="flex gap-8">
            {/* 主内容区 */}
            <main className="flex-1">
              {posts.map((post, index) => (
                <PostCard
                  key={post._id}
                  post={post}
                  index={index}
                  lastIndex={posts.length - 1}
                  keyword={search}
                />
              ))}

              {!showAll && totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      setShowAll(true);
                      fetchPosts(1, 15, search);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded"
                  >
                    Show More
                  </button>
                </div>
              )}

              {shouldShowPagination && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 rounded font-medium ${
                          page === i + 1
                            ? "bg-yellow-400 text-black"
                            : "bg-gray-200 text-black hover:bg-gray-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* 右侧栏 */}
            <aside className="w-[320px] space-y-6">
              <div className="bg-white shadow-md rounded p-4">
                <h2 className="text-md font-medium mb-2 text-center text-black">Search Mode</h2>
                <div className="flex justify-between items-center text-sm font-medium mb-2 px-2">
                  <span className={`${searchMode === "keyword" ? "text-yellow-500" : "text-gray-400"}`}>Keyword</span>
                  <span className={`${searchMode === "direct" ? "text-yellow-500" : "text-gray-400"}`}>Direct</span>
                </div>
             <div className="flex justify-center mt-2">
  <div
    className="relative w-12 h-6 bg-gray-500 rounded-full cursor-pointer"
    onClick={() => setSearchMode(searchMode === "keyword" ? "direct" : "keyword")}
  >
    <div
      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
        searchMode === "keyword" ? "translate-x-1" : "translate-x-6"
                    }`}
                  ></div>
                </div>
              </div>
              </div>

              <div className="bg-white shadow-md rounded p-4">
                <div className="flex items-center space-x-4 mb-2">
                  <img
                    src={userInfo.anonymous ? "/default-avatar.png" : userInfo.avatarUrl || "/default-avatar.png"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-black font-medium text-sm">
                    {userInfo.anonymous ? "Anonymous User" : userInfo.username || "Unnamed"}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-medium mb-2">
                  <span className="text-gray-600">Anonymous Mode</span>
                <div
  className="relative w-12 h-6 bg-gray-500 rounded-full cursor-pointer"
  onClick={() =>
    setUserInfo((prev) => ({ ...prev, anonymous: !prev.anonymous }))
  }
>
  <div
    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
      userInfo.anonymous ? "translate-x-6" : "translate-x-1"
                      }`}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">When anonymous is enabled, others will not see your name or avatar when you post.</p>
              </div>

              <div className="bg-white shadow-md rounded p-4 text-black">
                <h2 className="text-xl font-semibold mb-4">Post Something</h2>
                <textarea
                  className="w-full h-40 p-3 border rounded bg-gray-100 resize-none mb-2"
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
    </div>
  );
}
  