"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminLoginPage() {
  const { signIn, isAdmin, firebaseUser, isLoading, error } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && firebaseUser && isAdmin) {
      router.replace("/admin");
    }
  }, [isLoading, firebaseUser, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      // AdminGate will redirect once isAdmin resolves
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {/* Grid texture */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="text-[10px] tracking-[0.4em] text-indigo-400 uppercase mb-2">Cocycle</div>
          <div className="text-[10px] tracking-[0.3em] text-slate-600 uppercase">Admin Console</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest text-slate-600 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-slate-900/80 border border-slate-800 rounded px-4 py-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500/60 transition-colors"
              placeholder="admin@cocycle.app"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-slate-600 uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-slate-900/80 border border-slate-800 rounded px-4 py-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500/60 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {displayError && (
            <div className="text-[11px] text-red-400 font-mono py-2 px-3 bg-red-500/5 border border-red-500/20 rounded">
              {displayError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:text-indigo-700 text-white rounded py-3 text-xs tracking-widest uppercase transition-colors"
          >
            {submitting ? "Authenticating..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}