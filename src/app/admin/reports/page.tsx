"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useReports } from "@/hooks/useAdminQueries";
import { StatusBadge, EntityBadge, ReasonBadge } from "@/components/admin/ReportBadge";
import { formatDistanceToNow } from "date-fns";

const STATUS_FILTERS = ["all", "pending", "reviewed", "resolved", "dismissed"];
const ENTITY_FILTERS = ["all", "ride", "user", "community", "chat_message"];

export default function ReportsPage() {
  const { idToken } = useAdminAuth();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [entityFilter, setEntityFilter] = useState("all");

  const { data: reports, isLoading } = useReports(idToken, {
    status: statusFilter === "all" ? undefined : statusFilter,
    entityType: entityFilter === "all" ? undefined : entityFilter,
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[10px] font-mono tracking-[0.3em] text-slate-600 uppercase mb-2">Moderation</div>
        <h1 className="text-2xl font-light text-slate-100" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Reports</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-700 mb-2">Status</div>
          <div className="flex gap-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-[10px] font-mono rounded uppercase tracking-wider transition-colors ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-700 mb-2">Entity</div>
          <div className="flex gap-1 flex-wrap">
            {ENTITY_FILTERS.map((e) => (
              <button
                key={e}
                onClick={() => setEntityFilter(e)}
                className={`px-3 py-1.5 text-[10px] font-mono rounded uppercase tracking-wider transition-colors ${
                  entityFilter === e
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-600"
                }`}
              >
                {e.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-700 animate-pulse">Loading reports...</div>
        ) : !reports?.length ? (
          <div className="p-12 text-center text-xs font-mono text-slate-700">No reports found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60">
                {["Entity", "Reason", "Reporter", "Owner", "Status", "Submitted", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono tracking-widest uppercase text-slate-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors ${i === reports.length - 1 ? "border-0" : ""}`}
                >
                  <td className="px-4 py-3"><EntityBadge type={r.entityType} /></td>
                  <td className="px-4 py-3"><ReasonBadge reason={r.reason} /></td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.reporterName ?? "—"}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.entityOwnerName ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-[11px] font-mono text-slate-600 whitespace-nowrap">
                    {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/reports/${r.id}`}
                      className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 tracking-wider"
                    >
                      Review →
                    </Link>
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