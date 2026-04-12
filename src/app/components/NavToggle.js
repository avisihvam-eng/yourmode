"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavToggle() {
  const pathname = usePathname();
  const isToday = pathname === "/today" || pathname === "/";
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex border border-border rounded-lg overflow-hidden">
        <Link
          href="/today"
          className={`px-6 py-2 text-sm font-medium ${
            isToday
              ? "bg-white text-bg"
              : "bg-bg text-text-secondary hover:text-text"
          }`}
        >
          Today
        </Link>
        <Link
          href="/dashboard"
          className={`px-6 py-2 text-sm font-medium ${
            isDashboard
              ? "bg-white text-bg"
              : "bg-bg text-text-secondary hover:text-text"
          }`}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
