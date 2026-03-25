"use client";

import Link from "next/link";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useAdminStats, useReports } from "@/hooks/useAdminQueries";
import { StatusBadge, EntityBadge } from "@/components/admin/ReportBadge";
import { formatDistanceToNow } from "date-fns";

function StatCard({ label, value, sub, accent = false }: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-5 ${accent ? "border-amber-500/30 bg-amber-500/5" : "border-slate-800 bg-slate-900/40"}`}>
      <div className="text-[10px] font-mono tracking-widest uppercase text-slate-600 mb-3">{label}</div>
      <div className={`text-3xl font-mono font-light ${accent ? "text-amber-400" : "text-slate-200"}`}>{value}</div>
      {sub && <div className="text-[11px] font-mono text-slate-600 mt-1">{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const { idToken } = useAdminAuth();
  const { data: stats } = useAdminStats(idToken);
  const { data: recentReports, isLoading } = useReports(idToken, { limit: 5 } as any);

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <div className="text-[10px] font-mono tracking-[0.3em] text-slate-600 uppercase mb-2">Overview</div>
        <h1 className="text-2xl font-light text-slate-100" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <StatCard
          label="Pending Reports"
          value={stats?.pendingReports ?? "—"}
          sub={stats?.pendingReports === 0 ? "all clear" : "require review"}
          accent={(stats?.pendingReports ?? 0) > 0}
        />
        <StatCard
          label="Response Window"
          value="24h"
          sub="Apple App Store requirement"
        />
      </div>

      {/* Recent reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-600">Recent Reports</div>
          <Link href="/admin/reports" className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 tracking-wider">
            view all →
          </Link>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-xs font-mono text-slate-700">Loading...</div>
          ) : !recentReports?.length ? (
            <div className="p-8 text-center text-xs font-mono text-slate-700">No reports yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Type", "Reason", "Reporter", "Status", "Time"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-mono tracking-widest uppercase text-slate-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentReports.slice(0, 5).map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${i === recentReports.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-4 py-3"><EntityBadge type={r.entityType} /></td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.reason.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.reporterName ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-[11px] font-mono text-slate-600">
                      {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}