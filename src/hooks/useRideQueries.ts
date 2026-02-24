import { useQuery } from "@tanstack/react-query";
import { rideApi } from "@/services/api";

// Query keys factory for consistent key management
export const rideKeys = {
  all: ["rides"] as const,
  lists: () => [...rideKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...rideKeys.lists(), filters] as const,
  details: () => [...rideKeys.all, "detail"] as const,
  detail: (id: string) => [...rideKeys.details(), id] as const,
  participants: (id: string) => [...rideKeys.detail(id), "participants"] as const,
};

// Get single ride by ID
export function useRide(id: string) {
  return useQuery({
    queryKey: rideKeys.detail(id),
    queryFn: () => rideApi.getById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

// Get ride participants
export function useRideParticipants(id: string) {
  return useQuery({
    queryKey: rideKeys.participants(id),
    queryFn: () => rideApi.getParticipants(id),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get upcoming rides
export function useUpcomingRides(params?: {
  lat?: number;
  lng?: number;
  radius?: number;
}) {
  return useQuery({
    queryKey: rideKeys.list({ type: "upcoming", ...params }),
    queryFn: () => rideApi.getUpcoming(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}