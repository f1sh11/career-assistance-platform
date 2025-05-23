"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import CommunitySidebar from "../../components/CommunitySidebar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CommentPage() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`${API}/api/users/me/comments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComments(res.data);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <CommunitySidebar showReturn={true} />

      <div className="ml-48 flex-1 pt-[100px] px-8">
        <h1 className="text-5xl font-bold mb-12 text-black">My Comments</h1>

        {comments.length === 0 ? (
          <p className="text-gray-600">No comments yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {comments.map((comment) => {
              const postId = comment.postId?._id;
              const postTitle = comment.postId?.title || "Deleted Post";

              if (!postId) {
                return (
                  <div key={comment._id} className="bg-gray-100 rounded-lg p-6 text-black opacity-50">
                    <h2 className="text-xl font-semibold mb-2">Original post was deleted</h2>
                    <p className="text-gray-700">"{comment.text}"</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              }

              return (
                <Link href={`/community/article/${postId}`} key={comment._id}>
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2 text-black">
                      Commented on: {postTitle}
                    </h2>
                    <p className="text-gray-700">"{comment.text}"</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
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
