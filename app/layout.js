// layout.js - 保留原始结构，仅在 body 末尾添加 dropdown-root 容器
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Curtin Singapore Platform",
  description: "Student career support and community engagement platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen`}>
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        {children}

        {/* ✅ 挂载 dropdown 的容器（供 portal 使用） */}
        <div id="dropdown-root" className="z-[99999] absolute top-0 left-0 w-screen h-screen pointer-events-none" />
      </body>
    </html>
  );
}