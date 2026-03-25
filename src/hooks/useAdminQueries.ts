import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/services/adminApi";
import { ReviewReportRequest } from "@/types/admin";

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  reports: (filters?: object) => [...adminKeys.all, "reports", filters] as const,
  report: (id: string) => [...adminKeys.all, "reports", id] as const,
  users: (filters?: object) => [...adminKeys.all, "users", filters] as const,
  actions: (filters?: object) => [...adminKeys.all, "actions", filters] as const,
};

// ── Stats ────────────────────────────────────────────────────────────────────

export function useAdminStats(token: string | null) {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminApi.getStats(token!),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}

// ── Reports ──────────────────────────────────────────────────────────────────

export function useReports(
  token: string | null,
  filters?: { status?: string; entityType?: string }
) {
  return useQuery({
    queryKey: adminKeys.reports(filters),
    queryFn: () => adminApi.getReports(token!, filters),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}

export function useReport(token: string | null, id: string) {
  return useQuery({
    queryKey: adminKeys.report(id),
    queryFn: () => adminApi.getReportById(token!, id),
    enabled: !!token && !!id,
  });
}

export function useReviewReport(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ReviewReportRequest }) =>
      adminApi.reviewReport(token!, id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: adminKeys.reports() });
      qc.invalidateQueries({ queryKey: adminKeys.report(id) });
      qc.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

// ── Content removal ──────────────────────────────────────────────────────────

export function useRemoveMessage(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      adminApi.removeMessage(token!, id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.reports() });
    },
  });
}

export function useRemoveRide(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      adminApi.removeRide(token!, id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.reports() });
    },
  });
}

export function useRemoveCommunity(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      adminApi.removeCommunity(token!, id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.reports() });
    },
  });
}

// ── Users ────────────────────────────────────────────────────────────────────

export function useAdminUsers(
  token: string | null,
  filters?: { isBanned?: boolean; search?: string }
) {
  return useQuery({
    queryKey: adminKeys.users(filters),
    queryFn: () => adminApi.getUsers(token!, filters),
    enabled: !!token,
    staleTime: 1000 * 60,
  });
}

export function useBanUser(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.banUser(token!, id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useUnbanUser(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => adminApi.unbanUser(token!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

// ── Audit log ────────────────────────────────────────────────────────────────

export function useAdminActions(token: string | null) {
  return useQuery({
    queryKey: adminKeys.actions(),
    queryFn: () => adminApi.getActions(token!),
    enabled: !!token,
    staleTime: 1000 * 60,
  });
}