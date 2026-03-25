"use client";

import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useAdminActions } from "@/hooks/useAdminQueries";
import { format } from "date-fns";

const ACTION_STYLES: Record<string, string> = {
  user_banned:          "text-rose-400 border-rose-500/20 bg-rose-500/5",
  user_unbanned:        "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  report_resolved:      "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  report_dismissed:     "text-slate-500 border-slate-500/20 bg-slate-500/5",
  report_reviewed:      "text-blue-400 border-blue-500/20 bg-blue-500/5",
  ride_removed:         "text-amber-400 border-amber-500/20 bg-amber-500/5",
  community_removed:    "text-amber-400 border-amber-500/20 bg-amber-500/5",
  message_removed:      "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
};

export default function ActionsPage() {
  const { idToken } = useAdminAuth();
  const { data: actions, isLoading } = useAdminActions(idToken);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="text-[10px] font-mono tracking-[0.3em] text-slate-600 uppercase mb-2">Admin</div>
        <h1 className="text-2xl font-light text-slate-100" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Audit Log</h1>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-700 animate-pulse">Loading...</div>
        ) : !actions?.length ? (
          <div className="p-12 text-center text-xs font-mono text-slate-700">No actions recorded yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60">
                {["Action", "Entity", "Entity ID", "Note", "Time"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono tracking-widest uppercase text-slate-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actions.map((a, i) => {
                const style = ACTION_STYLES[a.actionType] ?? "text-slate-400 border-slate-700 bg-slate-800/30";
                return (
                  <tr
                    key={a.id}
                    className={`border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors ${i === actions.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono border px-2 py-0.5 rounded uppercase tracking-wider ${style}`}>
                        {a.actionType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{a.entityType ?? "—"}</td>
                    <td className="px-4 py-3 text-[11px] font-mono text-slate-600 max-w-[140px] truncate">{a.entityId ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      {a.note ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[11px] font-mono text-slate-600 whitespace-nowrap">
                      {format(new Date(a.createdAt), "dd MMM yyyy, HH:mm")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}