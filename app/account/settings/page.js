"use client";

import Image from "next/image";

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* 内容区 */}
            <div className="flex flex-col items-center pt-[100px] px-6 space-y-8">
                <h1 className="text-5xl font-bold text-black mb-8">Settings</h1>

                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4 text-black">Change Nickname</h2>
                    <input
                        type="text"
                        placeholder="Enter new nickname"
                        className="w-full p-3 border rounded bg-gray-100 text-black mb-4"
                    />
                    <button className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition">
                        Save Changes
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4 text-black">Change Avatar</h2>
                    <input type="file" className="w-full text-black mb-4" />
                    <button className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition">
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}

