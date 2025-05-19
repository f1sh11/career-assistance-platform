"use client";
import React, { useState } from "react";
import { MessageCircle, User, Search, ArrowUpRight, ChevronDown, Calendar, Filter } from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const activityData = [
  {
    id: 1,
    icon: <MessageCircle className="text-blue-500" size={20} />, 
    message: "You commented on the post \"AI in Education\".",
    timestamp: "3 mins ago",
    date: "2024-05-06"
  },
  {
    id: 2,
    icon: <User className="text-green-500" size={20} />, 
    message: "You applied for mentor Alice Wong.",
    timestamp: "Yesterday",
    date: "2024-05-05"
  },
  {
    id: 3,
    icon: <User className="text-gray-500" size={20} />,
    message: "You viewed John Tan’s profile.",
    timestamp: "3 days ago",
    date: "2024-05-03"
  }
];

export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredData = activityData.filter((item) => {
    const matchesSearch = item.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? item.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 pt-24 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 flex justify-center items-center gap-2">
            <MessageCircle className="text-blue-600 animate-bounce-slow" size={28} /> Activity Log
          </h1>
          <p className="text-gray-500 text-sm">
            Track and review your interactions on the platform with ease.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 shadow bg-white w-full sm:w-auto">
            <Search className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search activity..."
              className="outline-none text-sm w-full bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 shadow bg-white w-full sm:w-auto">
            <Calendar className="text-gray-400" size={18} />
            <input
              type="date"
              className="outline-none text-sm bg-transparent w-full"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3 animate-fade-in">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow-md hover:shadow-lg transition-shadow px-5 py-4 rounded-xl border border-gray-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-all">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-800 group-hover:text-blue-600 font-medium">
                    {item.message}
                  </p>
                  <span className="text-xs text-gray-400">{item.timestamp}</span>
                </div>
              </div>
              <ArrowUpRight
                size={18}
                className="text-gray-400 group-hover:text-blue-600 transition-colors"
              />
            </div>
          ))}

          {filteredData.length === 0 && (
            <p className="text-center text-gray-400 py-12 animate-fade-in">No activity found.</p>
          )}
        </div>

        <div className="mt-12 text-center">
          <button className="text-sm text-blue-600 hover:underline flex items-center gap-1 mx-auto animate-pulse">
            Load more activity <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
