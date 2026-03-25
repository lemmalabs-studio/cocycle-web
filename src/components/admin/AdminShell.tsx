"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▣" },
  { href: "/admin/reports", label: "Reports", icon: "⚑" },
  { href: "/admin/users", label: "Users", icon: "◈" },
  { href: "/admin/actions", label: "Audit Log", icon: "≡" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { adminUser, signOut } = useAdminAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-slate-800">
          <span className="text-xs font-mono tracking-[0.2em] text-indigo-400 uppercase">Cocycle</span>
          <div className="text-[10px] font-mono text-slate-600 mt-0.5 tracking-widest uppercase">Admin Console</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-mono transition-all ${
                  active
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                    : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <span className="text-xs opacity-70">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-500 truncate mb-2">{adminUser?.email}</div>
          <button
            onClick={signOut}
            className="w-full text-xs font-mono text-slate-600 hover:text-red-400 transition-colors text-left py-1"
          >
            → sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}