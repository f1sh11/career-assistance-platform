"use client";

import UserManagement from "../../components/admin/UserManagement";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-100 pt-24 pl-52 text-black">
      <AdminSidebar />
      <UserManagement />
    </div>
  );
}

