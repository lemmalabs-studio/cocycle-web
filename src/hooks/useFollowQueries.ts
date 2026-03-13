import { useQuery } from "@tanstack/react-query";
import { userProfileApi } from "@/services/api" // update to "@/services/api" if needed;

export const followKeys = {
  all: ["follow"] as const,
  user: (id: string) => ["user", id] as const,
  status: (userId: string) => [...followKeys.all, "status", userId] as const,
  followers: (userId: string) => [...followKeys.all, "followers", userId] as const,
  following: (userId: string) => [...followKeys.all, "following", userId] as const,
  stats: (userId: string) => [...followKeys.all, "stats", userId] as const,
};

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: followKeys.user(userId),
    queryFn: () => userProfileApi.getById(userId),
    staleTime: 1000 * 60 * 2,
    enabled: !!userId,
    placeholderData: (previousData) => previousData,
  });
}