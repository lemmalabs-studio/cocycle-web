import { useQuery } from "@tanstack/react-query";
import { communityApi } from "@/services/api";

// Query keys factory for consistent key management
export const communityKeys = {
  all: ["communities"] as const,
  lists: () => [...communityKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...communityKeys.lists(), filters] as const,
  featured: () => [...communityKeys.all, "featured"] as const,
  details: () => [...communityKeys.all, "detail"] as const,
  detail: (id: string) => [...communityKeys.details(), id] as const,
  members: (id: string) => [...communityKeys.detail(id), "members"] as const,
};

// Get single community by ID
export function useCommunity(id: string) {
  return useQuery({
    queryKey: communityKeys.detail(id),
    queryFn: () => communityApi.getById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

// Get community members
export function useCommunityMembers(id: string) {
  return useQuery({
    queryKey: communityKeys.members(id),
    queryFn: () => communityApi.getMembers(id),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get all communities
export function useCommunities() {
  return useQuery({
    queryKey: communityKeys.lists(),
    queryFn: () => communityApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get featured communities
export function useFeaturedCommunities() {
  return useQuery({
    queryKey: communityKeys.featured(),
    queryFn: () => communityApi.getFeatured(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}