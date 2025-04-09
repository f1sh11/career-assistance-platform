"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AccountPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        router.push("/login");
    };

    const menuItems = [
        { label: "Settings", route: "/settings" },
        { label: "Activity", route: "/activity" },
        { label: "Notifications", route: "/notifications" },
        { label: "Security", route: "/security" },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* 顶部菜单栏 */}
            <nav className="w-full bg-black text-white fixed top-0 left-0 z-50 flex justify-between items-center px-12 py-4">
                <div className="flex items-center space-x-4">
                    <Image src="/curtinlogo.png.png" alt="Curtin Singapore" width={50} height={50} />
                    <h1 className="text-xl font-light">Curtin Singapore</h1>
                </div>
                <div className="space-x-8 text-lg">
                    <a href="/" className="hover:text-yellow-400">Home</a>
                    <a href="/community" className="hover:text-yellow-400">Community</a>
                    <a href="/profile" className="hover:text-yellow-400">Profile</a>
                    <a href="/chat" className="hover:text-yellow-400">Chat</a>
                    <a href="/resources" className="hover:text-yellow-400">Resource</a>
                    <button
                        onClick={() => router.push("/account")}
                        className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
                    >
                        Account
                    </button>
                </div>
            </nav>

            {/* 图片背景区域 */}
            <div className="relative w-full h-[500px] mt-10">
                <Image
                    src="/Curtin5.jpg"
                    alt="Curtin Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="z-0"
                />
                {/* 标题覆盖 */}
                <div className="absolute inset-0 top-2/3 flex flex-col items-center justify-center z-10">
                    <h1 className="text-white text-5xl font-bold mb-16">MY ACCOUNT</h1>

                    {/* 四个功能按钮 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => router.push(item.route)}
                                className="w-60 h-48 bg-white bg-opacity-90 rounded-lg shadow-lg flex flex-col justify-center items-center hover:bg-yellow-400 hover:text-black transition text-2xl font-light text-black"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

{/* 灰色背景开始 */}
<div className="bg-gray-200 flex flex-col items-center py-16">

    {/* 按钮整体向下移动 */}
    <div className="flex flex-col items-center mt-24 space-y-8">
        
        {/* Profile按钮 */}
        <button
            onClick={() => router.push("/profile")}
            className="bg-gray-400 text-white w-300 py-4 rounded-lg text-2xl hover:bg-yellow-500 transition"
        >
            Go to Profile
        </button>

        {/* Logout按钮 */}
        <button
            onClick={handleLogout}
            className="bg-black text-white w-300 py-4 rounded-lg text-2xl hover:bg-red-600 transition"
        >
            Logout
        </button>
        </div>
    </div>
</div>


    );
}





