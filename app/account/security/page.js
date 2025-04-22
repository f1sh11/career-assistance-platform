"use client";

import Image from "next/image";

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* 内容区 */}
            <div className="flex flex-col items-center pt-[100px] px-6 space-y-8">
                <h1 className="text-5xl font-bold text-black mb-8">Security</h1>

                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl space-y-4">
                    <h2 className="text-2xl font-semibold mb-4 text-black">Change Password</h2>
                    <input type="password" placeholder="Current Password" className="w-full p-3 border rounded bg-gray-100 text-black" />
                    <input type="password" placeholder="New Password" className="w-full p-3 border rounded bg-gray-100 text-black" />
                    <input type="password" placeholder="Confirm New Password" className="w-full p-3 border rounded bg-gray-100 text-black" />
                    <button className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition">
                        Save Password
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl">
                    <h2 className="text-2xl font-semibold mb-6 text-black">Recent Logins</h2>
                    <div className="bg-gray-100 p-4 rounded text-black mb-2">April 10, 2025 - 13:00</div>
                    <div className="bg-gray-100 p-4 rounded text-black mb-2">April 9, 2025 - 22:30</div>
                    <div className="bg-gray-100 p-4 rounded text-black">April 8, 2025 - 09:15</div>
                </div>
            </div>
        </div>
    );
}

