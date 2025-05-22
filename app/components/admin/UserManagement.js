"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10 text-black">
      <h1 className="text-3xl font-bold mb-6">👥 User Management</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="space-y-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-6 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-1">
                {user.identifier || "Unnamed"}
              </h2>
              <p className="text-sm text-gray-600 mb-1">Email: {user.email}</p>
              <p className="text-sm text-gray-600 mb-1">Role: {user.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

