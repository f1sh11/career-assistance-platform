// components/CommunitySidebar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CommunitySidebar({ showReturn = false }) {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  const linkClass = (href) =>
    `hover:text-yellow-400 px-4 py-2 rounded ${
      isActive(href) ? "text-yellow-400 font-semibold" : ""
    }`;

  return (
    <aside className="w-48 bg-gray-800 text-white fixed top-[10px] left-0 h-screen z-40 flex flex-col pt-24 space-y-6">
      <Link href="/community/collect"><div className={linkClass("/community/collect")}>Collect</div></Link>
      <Link href="/community/comment"><div className={linkClass("/community/comment")}>Comment</div></Link>
      <Link href="/community/reply"><div className={linkClass("/community/reply")}>Reply</div></Link>
      {showReturn && (
        <Link href="/community"><div className={linkClass("/community")}>Return</div></Link>
      )}
    </aside>
  );
}


