import { ReportStatus, ReportReason, ReportEntityType } from "@/types/admin";

const STATUS_STYLES: Record<ReportStatus, string> = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  reviewed:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  resolved:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  dismissed: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const ENTITY_STYLES: Record<ReportEntityType, string> = {
  ride:         "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  user:         "bg-rose-500/10 text-rose-400 border-rose-500/20",
  community:    "bg-violet-500/10 text-violet-400 border-violet-500/20",
  chat_message: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

export function EntityBadge({ type }: { type: ReportEntityType }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${ENTITY_STYLES[type]}`}>
      {type.replace("_", " ")}
    </span>
  );
}

export function ReasonBadge({ reason }: { reason: ReportReason }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider bg-slate-800 text-slate-400 border-slate-700">
      {reason.replace(/_/g, " ")}
    </span>
  );
}