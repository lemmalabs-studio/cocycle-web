import { API_URL } from "@/lib/constants";
import { RideResponse, ParticipantResponse } from "@/types/ride";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(res.status, error.message || "Request failed");
  }

  return res.json();
}

// Ride API
export const rideApi = {
  getById: (id: string): Promise<RideResponse> => {
    return fetchApi<RideResponse>(`/api/rides/${id}`);
  },

  getParticipants: (id: string): Promise<ParticipantResponse[]> => {
    return fetchApi<ParticipantResponse[]>(`/api/rides/${id}/participants`);
  },

  getUpcoming: (params?: {
    lat?: number;
    lng?: number;
    radius?: number;
  }): Promise<RideResponse[]> => {
    const searchParams = new URLSearchParams();
    if (params?.lat) searchParams.set("lat", params.lat.toString());
    if (params?.lng) searchParams.set("lng", params.lng.toString());
    if (params?.radius) searchParams.set("radius", params.radius.toString());

    const query = searchParams.toString();
    return fetchApi<RideResponse[]>(`/api/rides/upcoming${query ? `?${query}` : ""}`);
  },
};