import { API_URL } from "@/lib/constants";
import {
  Report,
  AdminAction,
  AdminUser,
  AdminStats,
  ReviewReportRequest,
} from "@/types/admin";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchAdmin<T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(res.status, error.message || "Request failed");
  }

  return res.json();
}

export const adminApi = {
  // ── Stats ──────────────────────────────────────────────────────────────────
  getStats: (token: string): Promise<AdminStats> =>
    fetchAdmin("/api/admin/stats", token),

  // ── Reports ────────────────────────────────────────────────────────────────
  getReports: (
    token: string,
    params?: { status?: string; entityType?: string; limit?: number; offset?: number }
  ): Promise<Report[]> => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.entityType) q.set("entityType", params.entityType);
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.offset) q.set("offset", String(params.offset));
    const qs = q.toString();
    return fetchAdmin(`/api/admin/reports${qs ? `?${qs}` : ""}`, token);
  },

  getReportById: (token: string, id: string): Promise<Report> =>
    fetchAdmin(`/api/admin/reports/${id}`, token),

  reviewReport: (
    token: string,
    id: string,
    body: ReviewReportRequest
  ): Promise<void> =>
    fetchAdmin(`/api/admin/reports/${id}/review`, token, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers: (
    token: string,
    params?: { isBanned?: boolean; search?: string; limit?: number; offset?: number }
  ): Promise<AdminUser[]> => {
    const q = new URLSearchParams();
    if (params?.isBanned !== undefined) q.set("isBanned", String(params.isBanned));
    if (params?.search) q.set("search", params.search);
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.offset) q.set("offset", String(params.offset));
    const qs = q.toString();
    return fetchAdmin(`/api/admin/users${qs ? `?${qs}` : ""}`, token);
  },

  banUser: (token: string, id: string, reason: string): Promise<void> =>
    fetchAdmin(`/api/admin/users/${id}/ban`, token, {
      method: "POST",
      body: JSON.stringify({ userId: id, reason }),
    }),

  unbanUser: (token: string, id: string): Promise<void> =>
    fetchAdmin(`/api/admin/users/${id}/unban`, token, { method: "POST" }),

  // ── Content removal ────────────────────────────────────────────────────────
  removeRide: (token: string, id: string, note?: string): Promise<void> =>
    fetchAdmin(`/api/admin/rides/${id}${note ? `?note=${encodeURIComponent(note)}` : ""}`, token, {
      method: "DELETE",
    }),

  removeCommunity: (token: string, id: string, note?: string): Promise<void> =>
    fetchAdmin(`/api/admin/communities/${id}${note ? `?note=${encodeURIComponent(note)}` : ""}`, token, {
      method: "DELETE",
    }),

  removeMessage: (token: string, id: string, note?: string): Promise<void> =>
    fetchAdmin(`/api/admin/messages/${id}${note ? `?note=${encodeURIComponent(note)}` : ""}`, token, {
      method: "DELETE",
    }),

  // ── Audit log ──────────────────────────────────────────────────────────────
  getActions: (
    token: string,
    params?: { limit?: number; offset?: number }
  ): Promise<AdminAction[]> => {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.offset) q.set("offset", String(params.offset));
    const qs = q.toString();
    return fetchAdmin(`/api/admin/actions${qs ? `?${qs}` : ""}`, token);
  },
};