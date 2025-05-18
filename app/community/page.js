
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";
import axios from "axios";
import DOMPurify from "dompurify";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getDisplayUser(post) {
  return {
    name: post.isAnonymous ? "Anonymous User" : post.authorName || "Unnamed",
    avatar: post.isAnonymous ? "/default-avatar.png" : post.authorAvatarUrl || "/default-avatar.png",
  };
}

export function PostCard({ post, index, lastIndex, keyword }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  const highlight = (text, keyword) => {
    if (!keyword) return DOMPurify.sanitize(text);
    const safeText = DOMPurify.sanitize(text);
    return safeText.replace(
      new RegExp(`(${keyword})`, "gi"),
      '<mark class="bg-yellow-200">$1</mark>'
    );
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const distanceFromTop = rect.top;
      const disappearThreshold = 150;
      const bottomPreserveBuffer = 3;
      setVisible(index >= lastIndex - bottomPreserveBuffer || distanceFromTop >= disappearThreshold);
    };

    handleVisibility();
    window.addEventListener("scroll", handleVisibility);
    window.addEventListener("resize", handleVisibility);
    return () => {
      window.removeEventListener("scroll", handleVisibility);
      window.removeEventListener("resize", handleVisibility);
    };
  }, [index, lastIndex]);

  const { name, avatar } = getDisplayUser(post);

  return (
    <div ref={ref} className={`transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"} mb-4`}>
      <Link href={`/community/article/${post._id}`}>
        <div className="bg-white/90 rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm text-gray-700">{name}</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-black">{post.title}</h2>
          <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: highlight(post.content.slice(0, 100), keyword) }} />
          {post.status === "pending" && <p className="text-red-500 text-xs mt-2">Pending Review</p>}
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        setUserInfo({ username: user.identifier || "User", avatarUrl: `${API}${user.profile.avatarUrl}` || "/default-avatar.png", anonymous: false });
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

  const debouncedSearch = useRef(debounce((value) => {
    setShowAll(true);
    router.push(`?search=${encodeURIComponent(value)}`);
    fetchPosts(1, 15, value);
  }, 600)).current;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to post.");
    try {
      setLoading(true);
      await axios.post(`${API}/api/posts`, { title: newPost.slice(0, 50), content: newPost, isAnonymous: userInfo.anonymous }, { headers: { Authorization: `Bearer ${token}` } });
      setNewPost("");
      fetchPosts(1, showAll ? 15 : 3, search);
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (pageNum) => fetchPosts(pageNum, 15, search);
  const shouldShowPagination = showAll && totalPages > 1;
  const visiblePages = [...Array(totalPages)].map((_, i) => i + 1).filter(i => Math.abs(i - page) <= 2 || i === 1 || i === totalPages);

  return (
    <div className="min-h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('/Curtin2.jpg')" }}>
      <div className="bg-white/80 backdrop-blur-sm min-h-screen">
        <div className="sticky top-[80px] z-10 px-4 md:px-8 py-4">
          <div className="bg-white p-4 rounded shadow-md max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
            <input type="text" value={search} onChange={handleInputChange} placeholder="Search for posts..." className="flex-1 px-4 py-2 border rounded text-black" />
            <button onClick={() => debouncedSearch(search)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded">Search</button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-6">
          <aside className="w-28 fixed top-[64px] left-0 h-[calc(100vh-64px)] bg-gray-800 text-white pl-0 pr-2 hidden md:block">
            <Link href="/community/collect"><div className="hover:text-yellow-400 py-2">Collect</div></Link>
            <Link href="/community/comment"><div className="hover:text-yellow-400 py-2">Comment</div></Link>
            <Link href="/community/reply"><div className="hover:text-yellow-400 py-2">Reply</div></Link>
          </aside>

          <main className="flex-1 pt-6 mt-24">
            {posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} lastIndex={posts.length - 1} keyword={search} />
            ))}
            {shouldShowPagination && (
              <div className="flex justify-center mt-8 gap-2 flex-wrap">
                {visiblePages.map((num) => (
                  <button key={num} onClick={() => goToPage(num)} className={`px-3 py-1 rounded font-medium ${page === num ? "bg-yellow-400" : "bg-gray-200 hover:bg-gray-300"}`}>{num}</button>
                ))}
              </div>
            )}
          </main>

          <aside className="w-full md:w-80 flex-col space-y-6 hidden md:flex">
            <div className="bg-white shadow-md rounded p-4">
              <h2 className="text-md font-medium mb-2 text-center text-black">Search Mode</h2>
              <div className="flex justify-between text-sm font-medium mb-2 px-2">
                <span className={searchMode === "keyword" ? "text-yellow-500" : "text-gray-400"}>Keyword</span>
                <span className={searchMode === "direct" ? "text-yellow-500" : "text-gray-400"}>Direct</span>
              </div>
              <div className="relative w-12 h-6 bg-gray-300 rounded-full cursor-pointer mx-auto" onClick={() => setSearchMode(searchMode === "keyword" ? "direct" : "keyword")}> <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${searchMode === "keyword" ? "left-1" : "left-6 -translate-x-full"}`} /></div>
            </div>
            <div className="bg-white shadow-md rounded p-4">
              <div className="flex items-center gap-4 mb-2">
                <img src={userInfo.anonymous ? "/default-avatar.png" : userInfo.avatarUrl || "/default-avatar.png"} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                <div className="text-black font-medium text-sm">{userInfo.anonymous ? "Anonymous User" : userInfo.username || "Unnamed"}</div>
              </div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-600">Anonymous Mode</span>
                <div className="relative w-12 h-6 bg-gray-300 rounded-full cursor-pointer" onClick={() => setUserInfo((prev) => ({ ...prev, anonymous: !prev.anonymous }))}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${userInfo.anonymous ? "left-6 -translate-x-full" : "left-1"}`} />
                </div>
              </div>
              <p className="text-xs text-gray-500">When anonymous is enabled, others will not see your name or avatar when you post.</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded">
              <h2 className="text-xl font-semibold mb-4">Post Something</h2>
              <textarea className="w-full h-32 p-3 border rounded bg-gray-100 resize-none mb-2" placeholder="What's on your mind?" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
              <button onClick={handlePost} disabled={loading} className={`w-full ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 rounded`}>{loading ? "Posting..." : "Post"}</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
