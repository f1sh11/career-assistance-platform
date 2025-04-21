"use client";

import Image from "next/image";

export default function ActivityPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* 内容区 */}
            <div className="flex flex-col items-center pt-[100px] px-6 space-y-8">
                <h1 className="text-5xl font-bold text-black mb-8">Activity</h1>

                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl space-y-4">
                    <h2 className="text-2xl font-semibold mb-6 text-black">Recent Activities</h2>

                    <div className="bg-gray-100 p-4 rounded text-black">Viewed: "Choosing a Programming Language"</div>
                    <div className="bg-gray-100 p-4 rounded text-black">Commented on: "Career Advice"</div>
                    <div className="bg-gray-100 p-4 rounded text-black">Submitted: "Mentor Matching Application"</div>
                </div>
            </div>
        </div>
    );
}

