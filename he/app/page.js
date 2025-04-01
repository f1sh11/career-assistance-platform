"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleMenuClick = (route) => {
        if (!isLoggedIn) {
            router.push("/login");
        } else {
            router.push(route);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
            {/* Header */}
            <nav className="w-full bg-black fixed top-0 flex justify-between items-center px-12 py-6 z-50 border-b border-gray-700 text-lg">
                <div className="flex items-center space-x-4">
                    <Image src="/curtinlogo.png.png" alt="Curtin Singapore" width={60} height={60} />
                    <h1 className="text-2xl font-light">Curtin Singapore</h1>
                </div>

                <div className="flex space-x-12 items-center">
                    <button onClick={() => handleMenuClick("/")} className="hover:text-yellow-500">Home</button>
                    <button onClick={() => handleMenuClick("/community")} className="hover:text-yellow-500">Community</button>
                    <button onClick={() => handleMenuClick("/profile")} className="hover:text-yellow-500">Profile</button>
                    <button onClick={() => handleMenuClick("/chat")} className="hover:text-yellow-500">Chat</button>
                    <button onClick={() => handleMenuClick("/resources")} className="hover:text-yellow-500">Resource</button>

                    
                    {!isLoggedIn && (
                    <button 
                        onClick={() => router.push("/login")}
                        className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
                    >
                        Login
                    </button>
                    )}
                </div>
            </nav>


            {/* Hero Section */}
            <div className="relative h-screen flex items-center bg-cover bg-center px-0" style={{ backgroundImage: "url('/Curtin1.jpg.webp')" }}>
                <div className="bg-black/50 p-16 w-1/2 h-full flex flex-col justify-center text-left">
                    <h2 className="text-6xl font-light ml-12">Curtin University Student</h2>
                    <h3 className="text-3xl mt-4 ml-12 font-light">Career Assistance Platform</h3>
                </div>
                {/* 三角形区域 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-6">
                    {/* 上方 蓝色三角形 */}
                    <div className="relative w-132 h-30">
                        <div className="absolute w-0 h-0 border-l-[200px] border-l-transparent border-t-[200px] border-t-blue-600 border-r-[200px] border-r-transparent rotate-315"></div>
                    </div>
                    {/* 中央 黄色三角形 */}
                    {!isLoggedIn && (
                        <div className="relative w-200 h-0">
                            <div className="absolute w-0 h-0 border-l-[300px] border-l-transparent border-b-[300px] border-b-yellow-500 border-r-[300px] border-r-transparent rotate-45"></div>
                            <button disabled className="absolute top-16 left-20 text-black font-light text-3xl">
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* More Section */}
            <div className="px-12 py-24 text-center bg-gray-900 text-white">
                <h2 className="text-5xl font-light mb-12">More</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <Image src="/Connection.jpg" alt="Connection" width={400} height={250} className="mx-auto rounded-lg" />
                        <h3 className="text-4xl font-light mt-6 relative inline-block">
                            Connection
                            <span className="absolute left-0 top-full mt-2 w-16 h-4 bg-yellow-500"></span>
                        </h3>
                        <p className="text-lg mt-6 px-4">Develops a proper channel to link the students with the mentors, alumni and industry professional.</p>
                    </div>
                    <div>
                        <Image src="/Guidance.jpg" alt="Guidance" width={400} height={250} className="mx-auto rounded-lg" />
                        <h3 className="text-4xl font-light mt-6 relative inline-block">
                            Guidance
                            <span className="absolute left-0 top-full mt-2 w-16 h-4 bg-yellow-500"></span>
                        </h3>
                        <p className="text-lg mt-6 px-4">Through professional career counseling and skill development, provides students with clear directions and practical support.</p>
                    </div>
                    <div>
                        <Image src="/Friendliness.jpg" alt="Friendliness" width={400} height={250} className="mx-auto rounded-lg" />
                        <h3 className="text-4xl font-light mt-6 relative inline-block">
                            Friendliness
                            <span className="absolute left-0 top-full mt-2 w-16 h-4 bg-yellow-500"></span>
                        </h3>
                        <p className="text-lg mt-6 px-4">As an institution that embraces diversity and respect, create a friendly atmosphere for learners.</p>
                    </div>
                </div>
            </div>
        
            <div className="px-12 py-24 text-center bg-black text-white">
                <h2 className="text-5xl font-light mb-12">Be part of Us in Empowering Students</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <p className="text-lg">
                            We welcome professionals, mentors, and alumni to be a part of our mission to help students in their professional endeavors. You can help the next generation to learn from your knowledge, your stories, and your advice on how to face the obstacles and embrace the opportunities. It means that your guidance and your vision can change lives, help students to succeed and to become the best that can be.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <p className="text-lg">
                            We sincerely thank all partnering companies and academic institutions for their invaluable support and collaboration. Your dedication to fostering student growth and providing opportunities has created a bridge between education and industry. Together, we are equipping students with the skills, knowledge, and connections they need to excel in their careers. Your partnership is not only an investment in their future but also a cornerstone of a thriving, innovative community.
                        </p>
                    </div>
                </div>
            </div>{/*

            {/* Collaborators Section */}
            <div className="px-12 py-24 text-center">
                <h2 className="text-5xl font-light mb-8">Collaborators</h2>
                <div className="flex flex-wrap justify-center gap-12">
                    <Image src="/MIS.jpg" alt="MIS" width={150} height={75} />
                    <Image src="/SIMM.png" alt="SIMM" width={150} height={75} />
                    <Image src="/DB.jpg" alt="University" width={150} height={75} />
                    <Image src="/HF.jpg" alt="Institution" width={150} height={75} />
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black py-12 text-center text-gray-400 text-lg">
                <p>&copy; 2024 Curtin Singapore. All rights reserved.</p>
            </footer>
        </div>
    );
}
