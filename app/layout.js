import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 页面的metadata
export const metadata = {
  title: "Curtin Singapore Platform",
  description: "Student career support and community engagement platform.",
};

// 正确的唯一默认导出
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen`}> 
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
