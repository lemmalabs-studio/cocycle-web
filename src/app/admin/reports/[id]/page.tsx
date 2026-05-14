"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  useReport,
  useReviewReport,
  useRemoveMessage,
  useRemoveRide,
  useRemoveCommunity,
} from "@/hooks/useAdminQueries";
import { StatusBadge, EntityBadge, ReasonBadge } from "@/components/admin/ReportBadge";
import { format } from "date-fns";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-mono tracking-widest uppercase text-slate-600 mb-1.5">{label}</div>
      <div className="text-sm text-slate-300" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{children}</div>
    </div>
  );
}

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { idToken } = useAdminAuth();

  const { data: report, isLoading } = useReport(idToken, id);
  const reviewMutation = useReviewReport(idToken);
  const removeMsgMutation = useRemoveMessage(idToken);
  const removeRideMutation = useRemoveRide(idToken);
  const removeCommMutation = useRemoveCommunity(idToken);

  const [adminNote, setAdminNote] = useState("");
  const [banReason, setBanReason] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleReview = async (status: "reviewed" | "resolved" | "dismissed") => {
    await reviewMutation.mutateAsync({ id, body: { status, adminNote: adminNote || undefined } });
    setActionFeedback(`Marked as ${status}`);
  };

  const handleRemoveContent = async () => {
    if (!report) return;
    const note = adminNote || undefined;
    try {
      if (report.entityType === "chat_message") {
        await removeMsgMutation.mutateAsync({ id: report.entityId, note });
      } else if (report.entityType === "ride") {
        await removeRideMutation.mutateAsync({ id: report.entityId, note });
      } else if (report.entityType === "community") {
        await removeCommMutation.mutateAsync({ id: report.entityId, note });
      }
      await handleReview("resolved");
      setActionFeedback("Content removed and report resolved");
    } catch (e: any) {
      setActionFeedback(`Error: ${e.message}`);
    }
  };

  const isBusy =
    reviewMutation.isPending ||
    removeMsgMutation.isPending ||
    removeRideMutation.isPending ||
    removeCommMutation.isPending;

  if (isLoading) {
    return (
      <div className="p-8 text-xs font-mono text-slate-700 animate-pulse">Loading report...</div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-xs font-mono text-slate-700">Report not found.</div>
    );
  }

  const canRemoveContent = ["ride", "community", "chat_message"].includes(report.entityType);

  return (
    <div className="p-8 max-w-3xl">
      {/* Back */}
      <Link href="/admin/reports" className="text-[10px] font-mono text-slate-600 hover:text-slate-400 tracking-wider mb-8 inline-block">
        ← Back to Reports
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-[10px] font-mono tracking-[0.3em] text-slate-600 uppercase mb-2">Report</div>
          <div className="flex items-center gap-3">
            <EntityBadge type={report.entityType} />
            <ReasonBadge reason={report.reason} />
            <StatusBadge status={report.status} />
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-600">
          {format(new Date(report.createdAt), "dd MMM yyyy, HH:mm")}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-6 mb-8 p-5 bg-slate-900/40 border border-slate-800 rounded-lg">
        <Field label="Reporter">{report.reporterName ?? "Unknown"}</Field>
        <Field label="Content Owner">{report.entityOwnerName ?? "Unknown"}</Field>
        <Field label="Entity ID">
          <span className="font-mono text-xs text-slate-500 break-all">{report.entityId}</span>
        </Field>
        {report.description && (
          <Field label="Description">{report.description}</Field>
        )}
      </div>

      {/* Message snapshot — only shown for chat_message reports */}
      {report.entityType === "chat_message" && (
        <div className="mb-8 p-5 bg-slate-900/60 border border-cyan-500/20 rounded-lg">
          <div className="text-[10px] font-mono tracking-widest uppercase text-cyan-600 mb-3">
            Message Snapshot
          </div>
          {report.messageSnapshot ? (
            <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {report.messageSnapshot}
            </p>
          ) : (
            <p className="text-xs font-mono text-slate-600">No snapshot available.</p>
          )}
          {report.chatIdSnapshot && (
            <div className="mt-3 text-[10px] font-mono text-slate-600">
              Chat ID: {report.chatIdSnapshot}
            </div>
          )}
        </div>
      )}

      {/* Admin note */}
      <div className="mb-6">
        <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-600 mb-2">
          Admin Note (optional)
        </label>
        <textarea
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          rows={3}
          placeholder="Internal note for audit log..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded px-4 py-3 text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:border-indigo-500/60 transition-colors resize-none"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
        />
      </div>

      {/* Action feedback */}
      {actionFeedback && (
        <div className="mb-6 text-[11px] font-mono text-emerald-400 px-4 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded">
          ✓ {actionFeedback}
        </div>
      )}

      {/* Actions */}
      {report.status === "pending" && (
        <div className="flex flex-wrap gap-3">
          {canRemoveContent && (
            <button
              onClick={handleRemoveContent}
              disabled={isBusy}
              className="px-4 py-2.5 text-xs font-mono tracking-wider uppercase rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white transition-colors"
            >
              Remove Content + Resolve
            </button>
          )}
          <button
            onClick={() => handleReview("resolved")}
            disabled={isBusy}
            className="px-4 py-2.5 text-xs font-mono tracking-wider uppercase rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white transition-colors"
          >
            Resolve
          </button>
          <button
            onClick={() => handleReview("reviewed")}
            disabled={isBusy}
            className="px-4 py-2.5 text-xs font-mono tracking-wider uppercase rounded bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white transition-colors"
          >
            Mark Reviewed
          </button>
          <button
            onClick={() => handleReview("dismissed")}
            disabled={isBusy}
            className="px-4 py-2.5 text-xs font-mono tracking-wider uppercase rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Already reviewed */}
      {report.status !== "pending" && (
        <div className="p-4 border border-slate-800 rounded-lg">
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-600 mb-2">Review Record</div>
          {report.reviewedAt && (
            <div className="text-xs font-mono text-slate-500">
              {format(new Date(report.reviewedAt), "dd MMM yyyy, HH:mm")}
            </div>
          )}
          {report.adminNote && (
            <div className="text-sm text-slate-400 mt-2" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {report.adminNote}
            </div>
          )}
        </div>
      )}
    </div>
  );
}