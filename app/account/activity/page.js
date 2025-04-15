"use client";

import Image from "next/image";

export default function ActivityPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <nav className="w-full bg-black text-white fixed top-0 left-0 z-50 flex justify-between items-center px-12 py-4">
                <div className="flex items-center space-x-4">
                    <Image src="/curtinlogo.png.png" alt="Curtin Singapore" width={50} height={50} />
                    <h1 className="text-xl font-light">Curtin Singapore</h1>
                </div>
            </nav>

            <div className="flex flex-col items-center pt-32 px-6 space-y-8">
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
