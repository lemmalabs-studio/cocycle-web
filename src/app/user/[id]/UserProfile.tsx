"use client";

import { useState } from "react";
import { useUserProfile } from "@/hooks/useFollowQueries";
import { useUserJoinedRides, useUserHostedRides } from "@/hooks/useRideQueries";
import { RideResponse } from "@/types/ride";

interface UserProfileProps {
  userId: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function initials(name?: string | null) {
  return (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDistance(meters: number) {
  const km = meters / 1000;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

function formatDate(startTime: string) {
  return new Date(startTime).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(startTime: string) {
  return new Date(startTime).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTypeColor(rideType: string) {
  switch (rideType) {
    case "Social":   return "bg-[#5B7FFF]";
    case "Training": return "bg-[#FF8A5B]";
    case "Chill":    return "bg-green-500";
    case "Fast":     return "bg-red-500";
    default:         return "bg-gray-400";
  }
}

// ─── Ride Card ───────────────────────────────────────────────────────────────

function RideCard({ ride }: { ride: RideResponse }) {
  return (
    <div className="bg-white rounded-2xl p-4 mb-3">
      {/* Top row: type badge + date */}
      <div className="flex items-center justify-between mb-2">
        <span className={`${getTypeColor(ride.rideType)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
          {ride.rideType}
        </span>
        <span className="text-[#9BA8B8] text-xs">{formatDate(ride.startTime)} · {formatTime(ride.startTime)}</span>
      </div>

      {/* Title */}
      <p className="text-[#1A2B4A] font-bold text-base mb-3">{ride.title}</p>

      {/* Stats row */}
      <div className="flex items-center">
        <div className="flex-1 text-center">
          <p className="text-[#9BA8B8] text-xs">Distance</p>
          <p className="text-[#1A2B4A] font-semibold text-sm">{formatDistance(ride.distance)}</p>
        </div>
        <div className="w-px h-6 bg-[#E5E9F0]" />
        <div className="flex-1 text-center">
          <p className="text-[#9BA8B8] text-xs">Pace</p>
          <p className="text-[#1A2B4A] font-semibold text-sm">{ride.paceMin}–{ride.paceMax} km/h</p>
        </div>
        <div className="w-px h-6 bg-[#E5E9F0]" />
        <div className="flex-1 text-center">
          <p className="text-[#9BA8B8] text-xs">Riders</p>
          <p className="text-[#1A2B4A] font-semibold text-sm">
            {ride.currentParticipants}{ride.maxParticipants > 0 ? `/${ride.maxParticipants}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isLoading, error } = useUserProfile(userId);
  const { data: joinedRides = [], isLoading: isLoadingJoined } = useUserJoinedRides(userId);
  const { data: hostedRides = [], isLoading: isLoadingHosted } = useUserHostedRides(userId);

  const [activeTab, setActiveTab] = useState<"joined" | "hosted">("joined");

  const isLoadingRides = isLoadingJoined || isLoadingHosted;
  const filteredRides = activeTab === "joined" ? joinedRides : hostedRides;

  // ── Loading ──
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA]">
        {/* Blue banner skeleton */}
        <div className="h-44 bg-[#5B7FFF]/30 animate-pulse" style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} />
        {/* Avatar skeleton */}
        <div className="flex flex-col items-center -mt-14 px-5">
          <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white animate-pulse" />
          <div className="h-6 w-40 bg-gray-200 rounded mt-3 animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse" />
        </div>
      </main>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1A2B4A]">Failed to load profile</h1>
          <p className="text-[#6B7A90] mt-2">{(error as Error).message || "Something went wrong"}</p>
        </div>
      </main>
    );
  }

  // ── Not found ──
  if (!user) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#9BA8B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1A2B4A]">User not found</h1>
          <p className="text-[#6B7A90] mt-2">This user may have been deleted or doesn&apos;t exist.</p>
        </div>
      </main>
    );
  }

  const displayName = user.name || "Anonymous";

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-2xl mx-auto">

        {/* ── Blue Header Banner ── */}
        <div
          className="bg-[#5B7FFF] h-44 relative"
          style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        >
        </div>

        {/* ── Avatar — overlapping banner ── */}
        <div className="flex flex-col items-center -mt-14 z-10 relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center">
              <span className="text-[#1A2B4A] text-3xl font-bold">{initials(displayName)}</span>
            </div>
          )}

          {/* Name */}
          <h1 className="text-[#1A2B4A] text-2xl font-bold mt-3">{displayName}</h1>

          {/* Level / location */}
          {(user.level || user.location) && (
            <p className="text-[#6B7A90] text-sm mt-0.5">
              {[user.level, user.location].filter(Boolean).join(" · ")}
            </p>
          )}

          {/* Follower stats */}
          <div className="flex items-center mt-2 gap-1 text-sm text-[#6B7A90]">
            <span className="font-semibold text-[#1A2B4A]">{user.followingCount}</span>
            <span>Following</span>
            <span className="mx-1.5">·</span>
            <span className="font-semibold text-[#1A2B4A]">{user.followerCount}</span>
            <span>Followers</span>
          </div>
        </div>

        {/* ── Bio ── */}
        {user.bio && (
          <p className="text-[#1A2B4A] text-center text-sm leading-5 mt-3 px-8">{user.bio}</p>
        )}

        {/* ── CTA — Open in app ── */}
        <div className="px-5 mt-5">
          <a
            href={`cocycle://user/${user.id}`}
            className="block w-full bg-[#5B7FFF] text-white text-center font-bold text-base py-3.5 rounded-full hover:bg-[#4A6FEF] transition-colors"
          >
            View Profile in Cocycle
          </a>
          <p className="text-xs text-[#9BA8B8] text-center mt-2">
            Don&apos;t have the app?{" "}
            <span className="underline cursor-pointer hover:text-[#5B7FFF]">Download it here</span>
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="flex items-center justify-center mt-6 px-5">
          <div className="flex-1 text-center">
            <p className="text-[#9BA8B8] text-xs">Rides Joined</p>
            <p className="text-[#1A2B4A] text-base font-bold mt-0.5">{joinedRides.length} Rides</p>
          </div>
          <div className="w-px h-8 bg-[#E5E9F0]" />
          <div className="flex-1 text-center">
            <p className="text-[#9BA8B8] text-xs">Rides Hosted</p>
            <p className="text-[#1A2B4A] text-base font-bold mt-0.5">{hostedRides.length} Rides</p>
          </div>
        </div>

        {/* ── Ride History ── */}
        <div className="mt-6 px-5 pb-10">
          {/* Tab selector */}
          <div className="flex bg-gray-200 rounded-full p-1 mb-4">
            <button
              onClick={() => setActiveTab("joined")}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                activeTab === "joined"
                  ? "bg-[#5B7FFF] text-white"
                  : "text-[#6B7A90]"
              }`}
            >
              Joined Rides
            </button>
            <button
              onClick={() => setActiveTab("hosted")}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                activeTab === "hosted"
                  ? "bg-[#5B7FFF] text-white"
                  : "text-[#6B7A90]"
              }`}
            >
              Hosted Rides
            </button>
          </div>

          {/* Ride list */}
          {isLoadingRides ? (
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-[#5B7FFF] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[#6B7A90] text-sm">Loading ride history...</p>
            </div>
          ) : filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))
          ) : (
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center">
              <svg className="w-10 h-10 text-[#9BA8B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[#6B7A90] text-sm mt-2">No {activeTab} rides yet</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}