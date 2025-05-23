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
    <div className="min-h-screen bg-gray-50 flex">
      <CommunitySidebar showReturn={true} />

      <div className="ml-48 flex-1 pt-[80px] px-12">
        <h1 className="text-4xl font-bold mb-6 text-black">My Comments</h1>

        {comments.length === 0 ? (
          <p className="text-gray-600">You haven’t commented on anything yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-4xl">
            {comments.map((comment) => {
              const postId = comment.postId?._id;
              const postTitle = comment.postId?.title || "Deleted Post";
              const avatar = comment.postId?.authorAvatarUrl
                ? comment.postId.authorAvatarUrl
                : "/default-avatar.png";

              if (!postId) return null; // 忽略被删除的帖子

              return (
                <Link href={`/community/article/${postId}`} key={comment._id}>
                  <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <img
                        src={avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-800">
                          You commented on:{" "}
                          <span className="font-medium text-black">{postTitle}</span>
                        </span>
                        <span className="text-sm text-gray-600 truncate max-w-[360px]">
                          "{comment.text}"
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(comment.createdAt).toLocaleString()}
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
