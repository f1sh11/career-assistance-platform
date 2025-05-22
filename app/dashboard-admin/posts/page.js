"use client";

import PostManagement from "../../components/admin/PostManagement";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-gray-100 pt-24 pl-52 text-black">
      <AdminSidebar />
      <PostManagement />
    </div>
  );
}

