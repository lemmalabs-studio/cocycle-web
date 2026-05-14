import { RideResponse } from "./ride";

export interface CommunityResponse {
  id: string;
  name: string;
  description?: string;
  image?: string;
  type: string;
  activityLevel: string;
  location?: string;
  createdBy?: string;
  isFeatured: boolean;
  createdAt: string;
  memberCount: number;
  rides: RideResponse[];
}

export interface CommunityMemberResponse {
  userId: string;
  name?: string;
  avatar?: string;
  role: string;
  joinedAt: string;
}