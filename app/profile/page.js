// 🎓 教务系统风格 Profile 页面美化
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    introduction: "",
    phone: "",
    email: "",
    address: "",
    major: "",
    interests: "",
    skills: "",
    dreamJob: "",
    avatarUrl: "",
    mbtiType: ""
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", role: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({
          introduction: data.user.profile.introduction || "",
          phone: data.user.profile.phone || "",
          email: data.user.profile.email || "",
          address: data.user.profile.address || "",
          major: data.user.profile.major || "",
          interests: data.user.profile.interests || "",
          skills: data.user.profile.skills || "",
          dreamJob: data.user.profile.dreamJob || "",
          avatarUrl: data.user.profile.avatarUrl || "",
          mbtiType: data.user.profile.mbtiType || ""
        });
        setAvatarUrl(data.user.profile.avatarUrl || "");
        setUserInfo({
          username: data.user.identifier || "User",
          role: data.user.role || "Student",
        });
      } else {
        toast.error("Failed to load profile.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error loading profile.");
    }
  };

  const updateAvatarOnly = async (newAvatarUrl) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarUrl: newAvatarUrl })
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to update avatar: " + (data.message || ""));
      }
    } catch (error) {
      console.error("Avatar update error:", error);
      toast.error("Avatar update failed.");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));

    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/upload/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await response.json();
      if (data.avatarUrl) {
        const fullUrl = `${API_URL}${data.avatarUrl}`;
        setAvatarUrl(fullUrl);
        setFormData(prev => ({
          ...prev,
          avatarUrl: data.avatarUrl
        }));
        toast.success("Avatar uploaded successfully!");
        await updateAvatarOnly(data.avatarUrl);
        await fetchProfile();
      } else {
        toast.error("Avatar upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not logged in.");
        return;
      }

      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        fetchProfile();
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-24 pb-16 px-6 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src={previewUrl || `${API_URL}${avatarUrl}` || "/default-avatar.png"}
              alt="avatar"
              className="rounded-full w-32 h-32 border-4 border-white shadow-md object-cover"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
            <label className="absolute bottom-0 right-0 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded cursor-pointer">
              upload
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{userInfo.username}</h1>
            <p className="text-sm text-gray-500">identity：{userInfo.role}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">basic information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["phone", "email", "address", "major", "interests", "skills", "dreamJob"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}：</label>
                <input
                  name={field}
                  type="text"
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-400 bg-gray-50"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">MBTI type：</label>
              <input
                type="text"
                value={formData.mbtiType || "未测试"}
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium mb-1">introduce：</label>
            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              className="w-full h-32 border border-gray-300 rounded px-3 py-2 bg-gray-50 resize-none"
            />
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
              disabled={loading}
            >
              {loading ? "保存中..." : "save"}
            </button>
            <button
              onClick={() => router.push("/matching")}
              className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500 font-semibold"
            >
              Match
            </button>
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                if (token) {
                  const url = `http://localhost:3001/test?token=${token}`;
                  window.open(url, "_blank");
                } else {
                  alert("请先登录，未找到 token");
                }
              }}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-semibold"
            >
              MBTI TEST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}