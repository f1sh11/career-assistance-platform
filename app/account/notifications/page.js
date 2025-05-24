"use client";

import NotificationCard from "../../components/NotificationCard";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setNotifications(data.notifications || []);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const handleClearAll = async () => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications([]);
  };

  const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  };

  const groupedNotifications = groupBy(
    notifications.map((n) => {
      const date = new Date(n.createdAt);
      const today = new Date().toDateString();
      const itemDate = date.toDateString();
      return {
        ...n,
        dateGroup: itemDate === today ? "Today" : "Earlier"
      };
    }),
    "dateGroup"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-black dark:text-white py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-2">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Stay updated with the latest alerts and messages.</p>
          <button
            onClick={handleClearAll}
            className="mt-4 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {Object.keys(groupedNotifications).map((group) => (
          <div key={group} className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1">
              {group}
            </h2>
            {groupedNotifications[group].map((n) => (
              <NotificationCard
                key={n._id}
                title={n.title}
                message={n.message}
                time={new Date(n.createdAt).toLocaleTimeString()}
                onMarkRead={() => handleMarkRead(n._id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
