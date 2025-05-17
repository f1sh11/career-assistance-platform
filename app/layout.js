// layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import AutoLogout from "./components/AutoLogout";

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
    <html lang="en" suppressHydrationWarning>
      <body className="...">
        <Toaster position="top-center" reverseOrder={false} />
        <AutoLogout /> {/* ✅ 插入这里 */}
        <AuthProvider>
          <Navbar />
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </AuthProvider>
        <div id="dropdown-root" className="z-[99999] absolute top-0 left-0 w-screen h-screen pointer-events-none" />
      </body>
    </html>
  );
}

