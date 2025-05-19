"use client";

import { FaBell } from "react-icons/fa";

export default function NotificationCard({ title, message, time, onMarkRead }) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl shadow transition hover:shadow-lg hover:translate-y-[-2px] duration-200">
      <div className="flex items-start gap-4 px-6 py-4">
        <div className="flex items-center justify-center bg-yellow-100 rounded-full w-10 h-10">
          <FaBell className="text-yellow-500 w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-semibold text-gray-900 leading-tight">{title}</h3>
            <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2 leading-snug">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-4 border-t px-6 py-3 bg-gray-50 rounded-b-2xl">
        <button
          onClick={onMarkRead}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        >
          Mark as read
        </button>
        <button className="text-gray-600 hover:text-black text-sm font-medium transition">
          Details
        </button>
      </div>
    </div>
  );
}