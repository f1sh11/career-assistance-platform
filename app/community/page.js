"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";
import axios from "axios";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function PostCard({ post, index, lastIndex, keyword }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  const highlight = (text, keyword) =>
    keyword
      ? text.replace(
          new RegExp(`(${keyword})`, "gi"),
          '<mark class="bg-yellow-200">$1</mark>'
        )
      : text;

  useEffect(() => {
    const handleVisibility = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const distanceFromTop = rect.top;
      const disappearThreshold = 150;
      const bottomPreserveBuffer = 3;

      if (index >= lastIndex - bottomPreserveBuffer) {
        setVisible(true);
      } else {
        setVisible(distanceFromTop >= disappearThreshold);
      }
    };

    handleVisibility();
    window.addEventListener("scroll", handleVisibility);
    window.addEventListener("resize", handleVisibility);
    return () => {
      window.removeEventListener("scroll", handleVisibility);
      window.removeEventListener("resize", handleVisibility);
    };
  }, [index, lastIndex]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <Link href={`/community/article/${post._id}`}>
        <div className="bg-white/90 rounded-lg shadow-md p-6 mb-6 hover:shadow-xl transition cursor-pointer">
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotKeywords = ["career", "internship", "resume", "mentor", "event"];

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
        { title: newPost.slice(0, 50), content: newPost },
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
    <>
      <div className="fixed top-[100px] left-0 right-0 z-[9999] flex justify-center">
        <div className="bg-white p-4 rounded shadow-md w-full max-w-7xl flex space-x-4">
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
      </div>

      <div className="fixed top-[200px] right-10 w-80 bg-white shadow-md rounded p-4 z-[9999]">
        <h2 className="text-md font-medium mb-2 text-center">Search Mode</h2>
        <div className="flex justify-between items-center text-sm font-medium mb-2 px-2">
          <span className={`${searchMode === "keyword" ? "text-yellow-500" : "text-gray-400"}`}>Keyword</span>
          <span className={`${searchMode === "direct" ? "text-yellow-500" : "text-gray-400"}`}>Direct</span>
        </div>
        <div
          className="relative w-12 h-6 bg-gray-300 rounded-full cursor-pointer mx-auto"
          onClick={() => setSearchMode(searchMode === "keyword" ? "direct" : "keyword")}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
              searchMode === "keyword" ? "left-1" : "left-6 -translate-x-full"
            }`}
          ></div>
        </div>
      </div>

      {search && searchMode === "keyword" && (
        <div className="absolute top-[175px] left-[213px] bg-white shadow-md rounded p-2 w-full max-w-5xl z-[9990]">
          {hotKeywords
            .filter((kw) => kw.toLowerCase().includes(search.toLowerCase()))
            .map((kw, i) => (
              <div
                key={i}
                className="text-sm text-gray-800 hover:text-yellow-500 cursor-pointer"
                onClick={() => {
                  setSearch(kw);
                  handleSearch();
                }}
              >
                {kw}
              </div>
            ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <div
          className="w-[1690px] min-w-[1600px] mx-auto min-h-screen bg-fixed bg-cover bg-center"
          style={{ backgroundImage: "url('/Curtin2.jpg')" }}
        >
          <div className="flex">
            <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col cursor-pointer pt-24 space-y-6">
              <Link href="/community/collect"><div className="hover:text-yellow-400 px-4 py-2 rounded">Collect</div></Link>
              <Link href="/community/comment"><div className="hover:text-yellow-400 px-4 py-2 rounded">Comment</div></Link>
              <Link href="/community/reply"><div className="hover:text-yellow-400 px-4 py-2 rounded">Reply</div></Link>
            </aside>

            <div className="ml-48 flex flex-1 px-8 py-10 space-x-8">
              <main className="flex-1 overflow-y-auto pt-[160px] pb-[150px]">
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
                      {["First", "Prev"].map((label) => (
                        <button
                          key={label}
                          onClick={() => goToPage(label === "First" ? 1 : page - 1)}
                          disabled={page === 1}
                          className={`px-3 py-1 rounded ${
                            page === 1
                              ? "bg-blue-500 text-white opacity-50 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
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
                      {["Next", "Last"].map((label) => (
                        <button
                          key={label}
                          onClick={() => goToPage(label === "Last" ? totalPages : page + 1)}
                          disabled={page === totalPages}
                          className={`px-3 py-1 rounded ${
                            page === totalPages
                              ? "bg-blue-500 text-white opacity-50 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </main>

              <aside className="w-80 flex flex-col space-y-8">
                <div className="fixed bottom-10 right-10 w-80 bg-white shadow-md p-6 text-black z-50 rounded">
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
      </div>
    </>
  );
}