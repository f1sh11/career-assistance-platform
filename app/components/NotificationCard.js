"use client";

export default function NotificationCard({ title, message, time, onMarkRead }) {
  return (
    <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow-sm px-5 py-4 flex items-start justify-between group transition hover:shadow-md">
      <div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white group-hover:text-blue-600">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message}</p>
        <span className="text-xs text-gray-400 dark:text-gray-500">{time}</span>
      </div>
      <button
        onClick={onMarkRead}
        className="text-xs text-blue-500 hover:underline hover:text-blue-700 ml-4 mt-1"
      >
        Mark as read
      </button>
    </div>
  );
}
