"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    introduction: "",
    phone: "",
    email: "",
    address: "",
    major: "",
    interests: "",
    skills: "",
    dreamJob: "",
    avatarUrl: ""
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", role: "" });
  const router = useRouter();

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
          avatarUrl: data.user.profile.avatarUrl || ""
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
        toast.success("You have successfully saved!");
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
    <div className="relative bg-white w-full min-h-screen pt-[80px] text-black font-sans">
      <div
        className="relative bg-cover bg-center h-64 flex flex-col items-center justify-center"
        style={{ backgroundImage: "url('/profile-background.jpg')" }}
      >
        <div className="relative">
          <img
            src={previewUrl || `${API_URL}${avatarUrl}` || "/default-avatar.png"}
            alt="avatar"
            className="rounded-full w-24 h-24 border-4 border-white shadow-md mb-4"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer border border-gray-300 shadow">
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <h2 className="text-3xl font-bold text-black">{userInfo.username}</h2>
        <p className="text-lg font-semibold text-black mt-1">Identity: {userInfo.role}</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <label className="block text-lg font-medium mb-2">Self-introduction:</label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            className="w-full h-64 p-4 border rounded-md bg-gray-100 text-black resize-none"
            placeholder="Write about yourself..."
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {["phone", "email", "address", "major", "interests", "skills", "dreamJob"].map((name) => (
            <div key={name}>
              <label className="block text-sm font-medium capitalize">
                {name.replace(/([A-Z])/g, " $1")}:
              </label>
              <input
                name={name}
                type="text"
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100 text-black"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16 flex flex-col md:flex-row gap-6 justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full md:w-1/3 py-3 rounded transition ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {loading ? "Saving..." : "Confirm"}
        </button>
        <button
          onClick={() => router.push("/matching")}
          className="w-full md:w-1/3 bg-yellow-400 text-black py-3 rounded hover:bg-yellow-500 transition"
        >
          Start matching
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-500 mb-10">
          Loading, please wait...
        </div>
      )}
    </div>
  );
}

