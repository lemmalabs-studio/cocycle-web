"use client";

import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useAdminUsers, useBanUser, useUnbanUser } from "@/hooks/useAdminQueries";
import { format } from "date-fns";

function BanModal({
  userName,
  onConfirm,
  onCancel,
}: {
  userName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#0f0f18] border border-slate-800 rounded-lg p-6 w-full max-w-sm">
        <div className="text-[10px] font-mono tracking-widest uppercase text-rose-500 mb-4">Ban User</div>
        <p className="text-sm text-slate-300 mb-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Ban <span className="text-white font-medium">{userName}</span>? This prevents them from using the app.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for ban..."
          rows={3}
          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:border-rose-500/50 resize-none mb-4"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
        />
        <div className="flex gap-3">
          <button
            onClick={() => reason.trim() && onConfirm(reason)}
            disabled={!reason.trim()}
            className="flex-1 py-2 text-xs font-mono tracking-wider uppercase rounded bg-rose-700 hover:bg-rose-600 disabled:opacity-40 text-white transition-colors"
          >
            Confirm Ban
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-xs font-mono tracking-wider uppercase rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { idToken } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [bannedFilter, setBannedFilter] = useState<boolean | undefined>(undefined);
  const [banTarget, setBanTarget] = useState<{ id: string; name: string } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: users, isLoading } = useAdminUsers(idToken, {
    search: search.length >= 2 ? search : undefined,
    isBanned: bannedFilter,
  });

  const banMutation = useBanUser(idToken);
  const unbanMutation = useUnbanUser(idToken);

  const handleBan = async (reason: string) => {
    if (!banTarget) return;
    await banMutation.mutateAsync({ id: banTarget.id, reason });
    setFeedback(`${banTarget.name} banned`);
    setBanTarget(null);
  };

  const handleUnban = async (id: string, name: string) => {
    await unbanMutation.mutateAsync({ id });
    setFeedback(`${name} unbanned`);
  };

  return (
    <div className="p-8">
      {banTarget && (
        <BanModal
          userName={banTarget.name}
          onConfirm={handleBan}
          onCancel={() => setBanTarget(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="text-[10px] font-mono tracking-[0.3em] text-slate-600 uppercase mb-2">Moderation</div>
        <h1 className="text-2xl font-light text-slate-100" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Users</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="bg-slate-900/80 border border-slate-800 rounded px-4 py-2 text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:border-indigo-500/60 transition-colors w-64"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
        />
        <div className="flex gap-1">
          {[["All", undefined], ["Active", false], ["Banned", true]].map(([label, val]) => (
            <button
              key={String(label)}
              onClick={() => setBannedFilter(val as boolean | undefined)}
              className={`px-3 py-2 text-[10px] font-mono rounded uppercase tracking-wider transition-colors ${
                bannedFilter === val
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-600"
              }`}
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="mb-4 text-[11px] font-mono text-emerald-400 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded">
          ✓ {feedback}
        </div>
      )}

      {/* Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-700 animate-pulse">Loading users...</div>
        ) : !users?.length ? (
          <div className="p-12 text-center text-xs font-mono text-slate-700">No users found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60">
                {["Name", "Email", "Level", "Location", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono tracking-widest uppercase text-slate-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors ${i === users.length - 1 ? "border-0" : ""} ${u.isBanned ? "opacity-50" : ""}`}
                >
                  <td className="px-4 py-3 text-sm font-mono text-slate-300">{u.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{u.email}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{u.level ?? "—"}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{u.location ?? "—"}</td>
                  <td className="px-4 py-3 text-[11px] font-mono text-slate-600 whitespace-nowrap">
                    {format(new Date(u.createdAt), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    {u.isBanned ? (
                      <span className="text-[10px] font-mono text-rose-400 border border-rose-500/20 bg-rose-500/5 px-2 py-0.5 rounded uppercase">
                        Banned
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-500 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded uppercase">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "admin" && (
                      u.isBanned ? (
                        <button
                          onClick={() => handleUnban(u.id, u.name ?? u.email)}
                          className="text-[10px] font-mono text-slate-400 hover:text-emerald-400 tracking-wider transition-colors"
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          onClick={() => setBanTarget({ id: u.id, name: u.name ?? u.email })}
                          className="text-[10px] font-mono text-slate-600 hover:text-rose-400 tracking-wider transition-colors"
                        >
                          Ban
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}