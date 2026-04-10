export type ReportEntityType = "ride" | "user" | "community" | "chat_message";
export type ReportReason =
  | "spam"
  | "harassment"
  | "inappropriate_content"
  | "safety_concern"
  | "hate_speech"
  | "other";
export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string | null;
  entityType: ReportEntityType;
  entityId: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  messageSnapshot: string | null;
  chatIdSnapshot: string | null;
  entityOwnerId: string | null;
  entityOwnerName: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  adminNote: string | null;
  createdAt: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  actionType: string;
  entityType: string | null;
  entityId: string | null;
  reportId: string | null;
  note: string | null;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isBanned: boolean;
  bannedAt: string | null;
  banReason: string | null;
  level: string | null;
  location: string | null;
  createdAt: string;
  avatar: string | null;
}

export interface AdminStats {
  pendingReports: number;
}

export interface ReviewReportRequest {
  status: "reviewed" | "resolved" | "dismissed";
  adminNote?: string;
}

export interface BanUserRequest {
  userId: string;
  reason: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}