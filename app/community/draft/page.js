"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import CommunitySidebar from "../../components/CommunitySidebar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DraftPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDrafts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      console.log("📦 Token = ", token);

      const res = await axios.get(`${API}/api/posts/me/drafts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Drafts response:", res.data);
      setDrafts(res.data);
    } catch (err) {
      console.error("❌ Error fetching drafts:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDrafts();
}, []);


  return (
    <div className="min-h-screen bg-gray-100 flex">
      <CommunitySidebar showReturn={true} />

      <div className="ml-48 flex-1 pt-[100px] px-8 text-black">
        <h1 className="text-5xl font-bold mb-6">My Drafts</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : drafts.length === 0 ? (
          <p className="text-gray-600">No drafts available.</p>
        ) : (
          <div>
            <p className="mb-4 text-sm text-gray-500">Total drafts: {drafts.length}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {drafts.map((post) => (
                <div
  key={post._id}
  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition relative"
>
  {/* 删除按钮 */}
  <button
    onClick={async () => {
      const confirmed = window.confirm("Are you sure you want to delete this draft?");
      if (!confirmed) return;

      try {
        const token = sessionStorage.getItem("token");
        await axios.delete(`${API}/api/posts/drafts/${post._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 删除成功后移除这条草稿
        setDrafts((prev) => prev.filter((d) => d._id !== post._id));
      } catch (err) {
        alert("❌ Failed to delete draft");
        console.error(err);
      }
    }}
    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
    title="Delete draft"
  >
    ×
  </button>

  <h2 className="text-xl font-semibold text-black mb-2">
    {post.title || "(Untitled Draft)"}
  </h2>
  <p className="text-gray-700 mb-1">
    {(post.content || "").slice(0, 100)}...
  </p>
  <p className="text-xs text-gray-400 mb-2">
    Last updated: {new Date(post.updatedAt).toLocaleString()}
  </p>
  <Link href={`/community/edit/${post._id}`}>
    <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Continue Editing
    </button>
  </Link>
</div>

              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



