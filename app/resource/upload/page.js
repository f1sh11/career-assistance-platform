"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function UploadResourcePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    category: "Career Guides",
  });
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const categories = [
    "Career Guides",
    "Templates",
    "AI tool",
    "Interview Preparation",
    "Company Profiles",
    "Skill Development Courses"
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      console.warn("⛔ No token found. Redirecting to login...");
      router.push("/login");
      return;
    }

    axios.get(`${API}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      const user = res.data.user;
      if (!["mentor", "industry", "admin"].includes(user.role)) {
        console.warn("⛔ Role not allowed:", user.role);
        router.push("/resource");
      } else {
        setRole(user.role);
        console.log("✅ Authenticated as:", user.role);
      }
    })
    .catch((err) => {
      console.error("❌ Token invalid or expired:", err);
      router.push("/login");
    });
  }, [router]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = async () => {
    if (!file) return;
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await axios.post(`${API}/api/resources/upload-file`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData((prev) => ({ ...prev, fileUrl: res.data.url }));
      setMessage("✅ File uploaded successfully!");
    } catch (err) {
      console.error("❌ File upload failed:", err);
      setMessage("❌ File upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("❌ Token missing. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      await axios.post(`${API}/api/resources`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Resource submitted!");
      setFormData({
        title: "",
        description: "",
        fileUrl: "",
        category: "Career Guides"
      });
      setFile(null);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      if (err.response?.status === 401) {
        setMessage("⚠️ Token expired. Redirecting to login...");
        router.push("/login");
      } else {
        setMessage("❌ Resource submission failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-[100px]">
      <div className="bg-white p-10 rounded shadow-md w-full max-w-2xl text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload New Resource</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full p-3 border rounded bg-gray-100"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full p-3 border rounded bg-gray-100 h-32"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-gray-100"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* 上传文件区域 */}
          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 border rounded bg-gray-100"
            />
            <button
              type="button"
              onClick={handleFileUpload}
              className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
            >
              Upload File
            </button>
            {formData.fileUrl && (
              <p className="text-sm text-green-600 break-all">
                File uploaded: {formData.fileUrl}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Submit Resource
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
}
