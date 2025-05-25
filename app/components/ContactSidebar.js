// components/ContactSidebar.js
"use client";
import { useRouter } from "next/navigation";

export default function ContactSidebar({ chatList, targetId, onSelect, collapsed }) {
  const API_URL = "http://localhost:5000";
  const router = useRouter();

  return (
    <aside className={`bg-black text-white transition-all duration-300 ${collapsed ? 'w-0' : 'w-60'}`}>
      {!collapsed && (
        <div
          className="bg-blue-500 px-4 py-4 font-semibold cursor-pointer hover:bg-blue-600 transition"
          onClick={() => router.push("/matching")}
        >
          ← Return
        </div>
      )}
      {!collapsed && (
        <div className="flex flex-col">
          {chatList.map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 ${item.user._id === targetId ? "bg-gray-900" : ""}`}
              onClick={() => onSelect(item.user._id)}
            >
              <img
                src={`${API_URL}${item.user.profile.avatarUrl || "/default-avatar.png"}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col text-left">
                <span className="font-medium text-sm">{item.user.profile.name}</span>
                <span className="text-xs text-gray-400 truncate max-w-[160px]">
                  {item.lastMessage?.fileUrl
                    ? (item.lastMessage?.fileType?.startsWith("image/") ? "📷 Photo" : "📎 File")
                    : item.lastMessage?.text || ""}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
