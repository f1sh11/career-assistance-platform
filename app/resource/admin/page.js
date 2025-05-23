"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ResourceAdminPage() {
  const [resources, setResources] = useState([]);
  const [role, setRole] = useState("");
  const [toast, setToast] = useState("");
  const router = useRouter();

  const fetchPendingResources = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${API}/api/resources/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(res.data);
    } catch (err) {
      console.error("Failed to fetch pending resources", err);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleApprove = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(`${API}/api/resources/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources((prev) => prev.filter((res) => res._id !== id));
      showToast("✅ Resource approved!");
    } catch (err) {
      console.error("Approval failed", err);
      showToast("❌ Failed to approve.");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(`${API}/api/resources/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources((prev) => prev.filter((res) => res._id !== id));
      showToast("❌ Resource rejected.");
    } catch (err) {
      console.error("Rejection failed", err);
      showToast("⚠️ Failed to reject.");
    }
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return router.push("/");

    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      router.push("/");
    } else {
      setRole("admin");
      fetchPendingResources();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pl-52 pr-8 text-black relative">
      <AdminSidebar />
      <h1 className="text-4xl font-bold mb-6">🛠 Resource Approval Panel</h1>

      {resources.length === 0 ? (
        <p>No pending resources found.</p>
      ) : (
        <div className="space-y-6">
          {resources.map((res) => (
            <div key={res._id} className="bg-white rounded shadow p-6 space-y-2">
              <h2 className="text-2xl font-semibold">{res.title}</h2>
              <p className="text-sm text-gray-600">Category: {res.category}</p>
              <p>{res.description}</p>
              <p className="text-sm text-blue-600 break-words">
                <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  View Resource
                </a>
              </p>
              <p className="text-xs text-gray-500">
                Uploaded by: {res.uploader?.identifier || "Unknown"} ({res.uploader?.role})
              </p>
              <div className="flex space-x-4 pt-2">
                <button
                  onClick={() => handleApprove(res._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleReject(res._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in-out">
          {toast}
        </div>
      )}
    </div>
  );
}


