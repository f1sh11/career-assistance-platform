// components/admin/AdminSidebar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  const linkClass = (href) =>
    `px-4 py-2 rounded hover:text-yellow-400 transition ${
      isActive(href) ? "text-yellow-400 font-semibold" : "text-white"
    }`;

  return (
    <aside className="fixed top-[64px] left-0 w-48 h-full bg-gray-900 text-white pt-12 flex flex-col space-y-6 z-40">
      <Link href="/dashboard-admin/console">
        <div className={linkClass("/dashboard-admin/console")}>← Return to Console</div>
      </Link>
    </aside>
  );
}
