"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    introduction: "",
    phone: "",
    email: "",
    address: "",
    major: "",
    interests: "",
    skills: "",
    dreamJob: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
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
          dreamJob: data.user.profile.dreamJob || ""
        });
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Not logged in');
        return;
      }

      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');
        fetchProfile();
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative bg-white w-full min-h-screen pt-[80px] text-black font-sans">
      {/* Header 已全局引入，无需重复 */}

      {/* Top Section */}
      <div className="relative bg-cover bg-center h-64 flex flex-col items-center justify-center" style={{ backgroundImage: "url('/profile-background.jpg')" }}>
        <div className="rounded-full w-24 h-24 bg-gray-300 border-4 border-white shadow-md mb-4" />
        <h2 className="text-3xl font-bold text-black">Name</h2>
        <p className="text-lg font-semibold text-black mt-1">Identity: Student</p>
      </div>

      {/* Profile Info Section */}
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
              <label className="block text-sm font-medium capitalize">{name.replace(/([A-Z])/g, ' $1')}:</label>
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

      {/* Buttons */}
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
          className="w-full md:w-1/3 bg-yellow-400 text-black py-3 rounded hover:bg-yellow-500 transition"
        >
          Start matching
        </button>
      </div>
    </div>
  );
}