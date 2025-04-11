"use client";

import { useState } from "react";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/user/updateProfile', {
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

  return (
    <div className="relative bg-bottom w-full min-h-screen mt-10 bg-white/10 text-write font-sans">
      {/* Header */}
      <nav className="w-full bg-black text-white fixed top-0 left-0 z-50 flex justify-between items-center px-12 py-4">
        <div className="flex items-center space-x-4">
          <Image src="/curtinlogo.png.png" alt="Curtin Singapore" width={50} height={50} />
          <h1 className="text-xl font-light">Curtin Singapore</h1>
        </div>
        <div className="space-x-8 text-lg">
          <a href="/" className="hover:text-yellow-400">Home</a>
          <a href="/community" className="hover:text-yellow-400">Community</a>
          <a href="/profile" className="hover:text-yellow-400">Profile</a>
          <a href="/chat" className="hover:text-yellow-400">Chat</a>
          <a href="/resources" className="hover:text-yellow-400">Resource</a>
        </div>
      </nav>

      {/* Top Section */}
      <div className="relative bg-cover bg-2/3 h-64 flex flex-col items-center justify-center" style={{ backgroundImage: "url('/profile-background.jpg')" }}>
        <div className="rounded-full w-24 h-24 bg-gray-300 border-4 border-white shadow-md mb-4" />
        <h2 className="text-3xl font-light text-black font-bold">Name</h2>
        <p className="text-lg font-light text-black font-bold mt-1">Identity: Student</p>
      </div>

      {/* Profile Info Section */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        {/* Left - Self-intro */}
        <div className="md:col-span-1">
          <label className="block text-lg font-medium mb-2">Self-introduction:</label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            className="w-full h-64 p-4 border rounded-md bg-gray-100 resize-none"
            placeholder="Write about yourself..."
          />
        </div>

        {/* Right - Info sections */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Phone number:</label>
              <input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address:</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Major:</label>
              <input
                name="major"
                type="text"
                value={formData.major}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Interests:</label>
              <input
                name="interests"
                type="text"
                value={formData.interests}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Skills:</label>
              <input
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Dream job:</label>
              <input
                name="dreamJob"
                type="text"
                value={formData.dreamJob}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="max-w-3xl mx-auto px-6 pb-16 flex flex-col md:flex-row gap-6 justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full md:w-1/3 bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Saving..." : "Confirm"}
        </button>
        <button className="w-full md:w-1/3 bg-yellow-400 text-black py-3 rounded hover:bg-yellow-500 transition">Start matching</button>
      </div>
    </div>
  );
}