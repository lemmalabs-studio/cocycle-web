export type FollowStatus = "none" | "following" | "pending" | "blocked";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  gender: string | null;
  level: string | null;
  bio: string | null;
  location: string | null;
  favoriteStop: string | null;
  stravaConnected: boolean;
  followerCount: number;
  followingCount: number;
  createdAt: string;
  followStatus?: FollowStatus;
}