"use client";

import NotificationCard from "../../components/NotificationCard";
import { useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New mentor matched!",
      message: "You have been matched with Alice Wong.",
      time: "2 mins ago",
      dateGroup: "Today"
    },
    {
      id: 2,
      title: "System Maintenance",
      message: "Scheduled maintenance on May 1st from 2am to 4am.",
      time: "1 day ago",
      dateGroup: "This Week"
    },
    {
      id: 3,
      title: "New Job Postings",
      message: "3 new internship positions posted today.",
      time: "3 days ago",
      dateGroup: "This Week"
    }
  ]);

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    console.log(`Marked notification ${id} as read`);
  };

  const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  };

  const groupedNotifications = groupBy(notifications, "dateGroup");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-black dark:text-white py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-2">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Stay updated with the latest alerts and messages.</p>
          <button
            onClick={() => setNotifications([])}
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
                key={n.id}
                title={n.title}
                message={n.message}
                time={n.time}
                onMarkRead={() => handleMarkRead(n.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}