"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CollectPage() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/users/me/collections`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCollections(res.data);
      } catch (err) {
        console.error("Failed to load collections", err);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col pt-24 space-y-6">
        <Link href="/community/collect"><div className="hover:text-yellow-400 px-4 py-2">Collect</div></Link>
        <Link href="/community/comment"><div className="hover:text-yellow-400 px-4 py-2">Comment</div></Link>
        <Link href="/community/reply"><div className="hover:text-yellow-400 px-4 py-2">Reply</div></Link>
        <Link href="/community"><div className="hover:text-yellow-400 px-4 py-2">Return</div></Link>
      </aside>

      <div className="ml-48 flex-1 pt-[100px] px-8">
        <h1 className="text-5xl font-bold mb-12 text-black">My Collections</h1>

        {collections.length === 0 ? (
          <p className="text-gray-600">No collections yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {collections.map((post) => (
              <Link href={`/community/article/${post._id}`} key={post._id}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                  <h2 className="text-2xl font-semibold mb-2 text-black">{post.title}</h2>
                  <p className="text-gray-700">{post.content.slice(0, 80)}...</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




