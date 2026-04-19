"use client";

import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { label: "Today", path: "/" },
  { label: "Trend", path: "/trend" },
  { label: "Report", path: "/report" },
  { label: "Dashboard", path: "/dashboard" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-center z-50"
      style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}
    >
      <div className="w-full max-w-[390px] px-4 pb-6 pt-4">
        <div
          className="flex gap-1 rounded-2xl p-1"
          style={{ background: "#141414", border: "1px solid #1e1e1e" }}
        >
          {TABS.map((tab) => {
            const active = pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200"
                style={
                  active
                    ? { background: "#1DB47A", color: "#0a0a0a" }
                    : { color: "#666666" }
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
