"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import CommunitySidebar from "../../components/CommunitySidebar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CollectPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`${API}/api/users/me/collections`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to load collections", err);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CommunitySidebar showReturn={true} />

      <div className="ml-48 flex-1 pt-[80px] px-12">
        <h1 className="text-4xl font-bold mb-6 text-black">My Collections</h1>

        {posts.length === 0 ? (
          <p className="text-gray-600">You haven’t collected any posts yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-4xl">
            {posts.map((post) => {
              const avatar = post.authorAvatarUrl || "/default-avatar.png";

              return (
                <Link href={`/community/article/${post._id}`} key={post._id}>
                  <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <img
                        src={avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-800">
                          You collected:{" "}
                          <span className="font-medium text-black">{post.title}</span>
                        </span>
                        <span className="text-sm text-gray-600 truncate max-w-[360px]">
                          {post.content?.slice(0, 60)}...
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
