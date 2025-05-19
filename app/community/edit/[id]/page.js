"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import CommunitySidebar from "../../../components/CommunitySidebar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EditDraftPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

useEffect(() => {
  const fetchDraft = async () => {
    try {
      const localToken = localStorage.getItem("token"); 
      const res = await axios.get(`${API}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${localToken}` },
      });
      setPost({
        title: res.data.title || "",
        content: res.data.content || "",
      });
    } catch (err) {
      console.error("Failed to load draft", err);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchDraft();
}, [id]); 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (isDraft = true) => {
    try {
      await axios.put(
        `${API}/api/posts/${id}`,
        {
          ...post,
          isDraft: isDraft,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(isDraft ? "Draft saved." : "Post published.");
      setTimeout(() => {
        router.push("/community");
      }, 1500);
    } catch (err) {
      console.error("Failed to update draft", err);
      setMessage("❌ Error saving post.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <CommunitySidebar showReturn={true} />

      <main className="ml-48 flex-1 pt-[100px] px-8 text-black">
        <h1 className="text-5xl font-bold mb-6">Edit Draft</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={post.title}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-4 text-black"
              placeholder="Enter title"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              name="content"
              value={post.content}
              onChange={handleChange}
              rows={10}
              className="w-full border rounded p-2 mb-4 text-black"
              placeholder="Write your post here..."
            />

            <div className="flex gap-4">
              <button
                onClick={() => handleSave(true)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSave(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Publish
              </button>
            </div>

            {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
