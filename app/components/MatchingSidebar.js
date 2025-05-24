// components/MatchingSidebar.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MatchingSidebar({ showReturn = false }) {
  const pathname = usePathname();
  const [role, setRole] = useState("student");

  useEffect(() => {
    const stored = localStorage.getItem("role");
    if (stored) setRole(stored);
  }, []);

  const isActive = (href) => pathname === href;

  const linkClass = (href) =>
    `hover:text-yellow-400 px-4 py-2 rounded ${
      isActive(href) ? "text-yellow-400 font-semibold" : ""
    }`;

  return (
    <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col pt-24 space-y-6">
      {role === "student" ? (
        <>
          <Link href="/matching/mentors"><div className={linkClass("/matching/mentors")}>Mentors</div></Link>
          <Link href="/matching/alumni"><div className={linkClass("/matching/alumni")}>Alumni</div></Link>
          <Link href="/matching/professionals"><div className={linkClass("/matching/professionals")}>Professionals</div></Link>
        </>
      ) : (
        <Link href="/matching/requests"><div className={linkClass("/matching/requests")}>Student Requests</div></Link>
      )}
      <Link href="/matching/history"><div className={linkClass("/matching/history")}>History</div></Link>
      {showReturn && (
        <Link href="/matching"><div className={linkClass("/matching")}>Return</div></Link>
      )}
    </aside>
  );
}
