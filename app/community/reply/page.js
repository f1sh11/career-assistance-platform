"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import CommunitySidebar from "../../components/CommunitySidebar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ReplyPage() {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/users/me/replies`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReplies(res.data);
      } catch (err) {
        console.error("Failed to load replies", err);
      }
    };

    fetchReplies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <CommunitySidebar showReturn={true} />


      <div className="ml-48 flex-1 pt-[100px] px-8">
        <h1 className="text-5xl font-bold mb-12 text-black">My Replies Received</h1>

        {replies.length === 0 ? (
          <p className="text-gray-600">No replies received yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {replies.map((reply) => (
              <Link href={`/community/article/${reply.postId?._id}`} key={reply._id}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                  <h2 className="text-xl font-semibold mb-2 text-black">
                    Replied on: {reply.postId?.title || "Deleted Post"}
                  </h2>
                  <p className="text-gray-700">"{reply.text}"</p>
                  <p className="text-xs text-right text-gray-500 mt-2">
                    {new Date(reply.createdAt).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



