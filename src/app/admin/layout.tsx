"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminShell from "@/components/admin/AdminShell";

function AdminGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAdmin, firebaseUser } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!firebaseUser && pathname !== "/admin/login") {
      router.replace("/admin/login");
      return;
    }
    if (firebaseUser && !isAdmin && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [isLoading, isAdmin, firebaseUser, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-xs font-mono text-slate-600 tracking-widest animate-pulse">
          AUTHENTICATING...
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;

  if (!firebaseUser || !isAdmin) return null;

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');`}</style>
      <AdminGate>{children}</AdminGate>
    </AdminAuthProvider>
  );
}