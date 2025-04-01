/*homepage*/

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setHasMounted(true);
        const token = localStorage.getItem("token");
        if (token) setIsLoggedIn(true);
        const msg = localStorage.getItem("loginMessage");
        if (msg) {
            alert(msg);
            localStorage.removeItem("loginMessage");
        }
    }, []);

    if (!hasMounted) return null;

    return (
        <div className="min-h-screen w-full bg-black text-white font-sans overflow-x-hidden relative">

            {/* Header */}
            <nav className="w-full bg-black text-white fixed top-0 left-0 z-50 flex flex-wrap justify-between items-center px-6 md:px-12 py-4">
                <div className="flex items-center space-x-4">
                    <Image src="/curtinlogo.png.png" alt="Curtin Singapore" width={50} height={50} />
                    <h1 className="text-xl font-light">Curtin Singapore</h1>
                </div>
                <div className="space-x-4 md:space-x-8 text-base md:text-lg mt-2 md:mt-0">
                    <a href="/" className="hover:text-yellow-400">Home</a>
                    <a href="/community" className="hover:text-yellow-400">Community</a>
                    <a href="/profile" className="hover:text-yellow-400">Profile</a>
                    <a href="/chat" className="hover:text-yellow-400">Chat</a>
                    <a href="/resources" className="hover:text-yellow-400">Resource</a>
                    {!isLoggedIn ? (
                        <button
                            onClick={() => router.push("/login")}
                            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                setIsLoggedIn(false);
                                router.push("/login");
                            }}
                            className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </nav>

            {/* max-w 内容区域（包含 Hero） */}
            <div className="max-w-[1690px] mx-auto">

                {/* Hero Section - 与内容居中对齐 */}
                <div className="relative h-screen flex items-center bg-cover bg-center" style={{ backgroundImage: "url('/Curtin1.jpg.webp')" }}>
                    <div className="bg-black/50 p-8 md:p-16 w-full md:w-1/2 h-full flex flex-col justify-center text-left">
                        <h2 className="text-4xl md:text-6xl font-light ml-4 md:ml-12">Curtin University Student</h2>
                        <h3 className="text-2xl md:text-3xl mt-4 ml-4 md:ml-12 font-light">Career Assistance Platform</h3>
                    </div>

                    {/* 三角形区域 - 添加缩放 */}
                    <div className="absolute top-1/2 left-[34%] transform -translate-y-1/2 flex flex-col items-center space-y-6 scale-90 md:scale-100">
                        <div className="relative">
                            <div className="absolute top-[-50px] left-[0px] w-0 h-0 border-l-[100px] md:border-l-[200px] border-l-transparent border-t-[100px] md:border-t-[200px] border-t-blue-600 border-r-[100px] md:border-r-[200px] border-r-transparent rotate-315"></div>
                        </div>
                        <div className="relative">
                            <div className="absolute top-[50px] left-[-135px] w-0 h-0 border-l-[100px] md:border-l-[300px] border-l-transparent border-b-[150px] md:border-b-[300px] border-b-yellow-500 border-r-[150px] md:border-r-[300px] border-r-transparent rotate-45"></div>
                            <button disabled className="absolute top-8 md:top-16 left-80 md:left-20 text-black font-light text-2xl md:text-3xl"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
