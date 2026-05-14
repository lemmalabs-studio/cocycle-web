"use client";

import { useMemo, useState } from "react";
import { useCommunity, useCommunityMembers } from "@/hooks/useCommunityQueries";
import { RideResponse } from "@/types/ride";
import Link from "next/link";

interface CommunityDetailProps {
  communityId: string;
}

// Get hero gradient color based on community type
function getHeroColor(type?: string) {
  switch (type) {
    case "Training":
      return "#C05621";
    case "Mixed":
      return "#553C9A";
    default:
      return "#2B4FC7";
  }
}

function getAccentColor(type?: string) {
  switch (type) {
    case "Training":
      return "#FF8A5B";
    case "Mixed":
      return "#9B59B6";
    default:
      return "#5B7FFF";
  }
}

// Format date for ride cards
function formatRideDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatRideTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Ride Card Component
function RideCard({ ride }: { ride: RideResponse }) {
  const getTypeColor = () => {
    switch (ride.rideType) {
      case "Social":
        return "bg-[#5B7FFF]";
      case "Training":
        return "bg-[#FF8A5B]";
      case "Chill":
        return "bg-green-500";
      case "Fast":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  };

  return (
    <Link href={`/ride/${ride.id}`} className="block">
      <div className="bg-white rounded-2xl p-4 mb-3 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-[#1A2B4A] font-semibold">{ride.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`${getTypeColor()} text-white text-xs font-medium px-2 py-0.5 rounded-full`}>
                {ride.rideType}
              </span>
              {ride.hasCafe && (
                <span className="text-xs">☕</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#1A2B4A] font-medium text-sm">{formatRideDate(ride.startTime)}</p>
            <p className="text-[#6B7A90] text-xs">{formatRideTime(ride.startTime)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#6B7A90]">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {formatDistance(ride.distance)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {ride.paceMin}-{ride.paceMax} km/h
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
            </svg>
            {ride.currentParticipants}/{ride.maxParticipants}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CommunityDetail({ communityId }: CommunityDetailProps) {
  const { data: community, isLoading, error } = useCommunity(communityId);
  const { data: members = [] } = useCommunityMembers(communityId);

const [ridesTab, setRidesTab] = useState<"upcoming" | "past">("upcoming");

const now = new Date();
const filteredRides = community?.rides?.filter((ride) =>
  ridesTab === "upcoming"
    ? new Date(ride.startTime) >= now
    : new Date(ride.startTime) < now
) ?? [];

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5B7FFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7A90]">Loading community...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !community) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1A2B4A]">Community not found</h1>
          <p className="text-[#6B7A90] mt-2">This community may have been deleted or doesn&apos;t exist</p>
        </div>
      </main>
    );
  }

  const heroColor = getHeroColor(community.type);
  const accentColor = getAccentColor(community.type);

  // Find admin from members
  const adminMember = members.find((m) => m.role === "admin");

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Hero Banner */}
        <div
          className="relative min-h-[220px]"
          style={{
            backgroundColor: community.image ? undefined : heroColor,
            backgroundImage: community.image ? `url(${community.image})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay for image */}
          {community.image && (
            <div className="absolute inset-0 bg-black/45" />
          )}

          {/* Decorative circles for solid color hero */}
          {!community.image && (
            <>
              <div
                className="absolute w-48 h-48 rounded-full opacity-10"
                style={{ backgroundColor: "white", top: -24, right: -24 }}
              />
              <div
                className="absolute w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: "white", top: 40, right: 60 }}
              />
            </>
          )}

          {/* Community Identity */}
          <div className="relative flex flex-col justify-end min-h-[220px] px-5 pb-5">
            <div className="flex items-end">
              {/* Logo */}
              {community.image ? (
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-16 h-16 rounded-2xl border-2 border-white/30 mr-3 object-cover"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl mr-3 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 pb-1">
                <h1 className="text-white text-xl font-bold">{community.name}</h1>
                {community.location && (
                  <div className="flex items-center mt-1">
                    <svg className="w-3.5 h-3.5 text-white/75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-white/75 text-sm ml-1">{community.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-32">
          {/* Info Card */}
          <div className="bg-white rounded-3xl p-4 mb-4">
            {/* Type + Activity badges */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                {community.type || "General"}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  community.activityLevel === "High"
                    ? "bg-green-100 text-green-700"
                    : community.activityLevel === "Medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    community.activityLevel === "High"
                      ? "bg-green-500"
                      : community.activityLevel === "Medium"
                      ? "bg-amber-500"
                      : "bg-gray-400"
                  }`}
                />
                {community.activityLevel} Activity
              </span>
            </div>

            {/* Description */}
            {community.description && (
              <p className="text-[#6B7A90] text-sm leading-5 mb-3">{community.description}</p>
            )}

            {/* Stats */}
            <div className="flex bg-[#F5F7FA] rounded-2xl p-3">
              <div className="flex-1 text-center">
                <p className="text-[#1A2B4A] text-lg font-bold">{community.memberCount}</p>
                <p className="text-[#6B7A90] text-xs">Members</p>
              </div>
              <div className="w-px bg-[#E5E9F0]" />
              <div className="flex-1 text-center">
                <p className="text-[#1A2B4A] text-lg font-bold">{community.rides?.length || 0}</p>
                <p className="text-[#6B7A90] text-xs">Total Rides</p>
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="mb-5">
            <h2 className="text-[#1A2B4A] text-lg font-semibold mb-3">
              Members
              {community.memberCount > 0 && (
                <span className="text-[#6B7A90] text-sm font-normal"> · {community.memberCount}</span>
              )}
            </h2>
            {members.length > 0 ? (
              <div className="flex overflow-x-auto pb-2 -mx-5 px-5 gap-4">
                {members.map((member) => (
                  <div key={member.userId} className="flex-shrink-0 text-center">
                    <div className="relative">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name || "Member"}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#5B7FFF]/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#5B7FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      {member.role === "admin" && (
                        <div className="absolute -bottom-1 -right-1 bg-[#FF8A5B] rounded-full p-1">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-[#1A2B4A] text-xs font-medium mt-1.5 truncate max-w-[56px]">
                      {member.name?.split(" ")[0] || "User"}
                    </p>
                    <p className="text-[#9BA8B8] text-[10px]">{member.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#6B7A90] text-sm">No members yet — be the first to join!</p>
            )}
          </div>

          {/* Rides Section */}
          <div className="mb-5">
            <h2 className="text-[#1A2B4A] text-lg font-semibold mb-3">Rides</h2>
            
            {/* Tab Selector */}
            <div className="flex bg-white rounded-full p-1 mb-4">
              <button
                onClick={() => setRidesTab("upcoming")}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                  ridesTab === "upcoming" ? "bg-[#5B7FFF] text-white" : "text-[#6B7A90]"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setRidesTab("past")}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                  ridesTab === "past" ? "bg-[#5B7FFF] text-white" : "text-[#6B7A90]"
                }`}
              >
                Past
              </button>
            </div>

            {filteredRides.length > 0 ? (
              filteredRides.map((ride) => <RideCard key={ride.id} ride={ride} />)
            ) : (
              <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-[#E5E9F0]">
                <div className="w-14 h-14 rounded-full bg-[#5B7FFF]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-[#5B7FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <p className="text-[#1A2B4A] font-semibold mb-1">No rides yet</p>
                <p className="text-[#6B7A90] text-sm">
                  {ridesTab === "past"
                    ? "No past rides yet"
                    : "Join the community to see and create rides"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar - Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E9F0] p-4 lg:hidden">
          <a
            href={`cocycle://community/${community.id}`}
            className="block w-full bg-[#5B7FFF] text-white text-center font-bold text-lg py-4 rounded-full hover:bg-[#4A6FEF] transition-colors"
          >
            Open in Cocycle
          </a>
          <p className="text-xs text-[#9BA8B8] text-center mt-2">
            Don&apos;t have the app? <span className="underline cursor-pointer">Download it here</span>
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen">
        {/* Hero Banner - Full Width */}
        <div
          className="relative h-[300px]"
          style={{
            backgroundColor: community.image ? undefined : heroColor,
            backgroundImage: community.image ? `url(${community.image})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {community.image && <div className="absolute inset-0 bg-black/45" />}
          {!community.image && (
            <>
              <div
                className="absolute w-96 h-96 rounded-full opacity-10"
                style={{ backgroundColor: "white", top: -100, right: -50 }}
              />
              <div
                className="absolute w-64 h-64 rounded-full opacity-10"
                style={{ backgroundColor: "white", top: 50, right: 150 }}
              />
            </>
          )}

          <div className="relative max-w-4xl mx-auto h-full flex items-end px-8 pb-8">
            <div className="flex items-end">
              {community.image ? (
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-24 h-24 rounded-2xl border-4 border-white/30 mr-4 object-cover"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl mr-4 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              )}
              <div className="pb-2">
                <h1 className="text-white text-3xl font-bold">{community.name}</h1>
                {community.location && (
                  <div className="flex items-center mt-1">
                    <svg className="w-4 h-4 text-white/75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-white/75 ml-1">{community.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Info */}
            <div className="col-span-1">
              {/* Info Card */}
              <div className="bg-white rounded-2xl p-5 mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {community.type || "General"}
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      community.activityLevel === "High"
                        ? "bg-green-100 text-green-700"
                        : community.activityLevel === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        community.activityLevel === "High"
                          ? "bg-green-500"
                          : community.activityLevel === "Medium"
                          ? "bg-amber-500"
                          : "bg-gray-400"
                      }`}
                    />
                    {community.activityLevel}
                  </span>
                </div>

                {community.description && (
                  <p className="text-[#6B7A90] text-sm leading-relaxed mb-4">{community.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-[#E5E9F0]">
                  <div className="text-center">
                    <p className="text-[#1A2B4A] text-2xl font-bold">{community.memberCount}</p>
                    <p className="text-[#6B7A90] text-sm">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#1A2B4A] text-2xl font-bold">{community.rides?.length || 0}</p>
                    <p className="text-[#6B7A90] text-sm">Rides</p>
                  </div>
                </div>

                <a
                  href={`cocycle://community/${community.id}`}
                  className="block w-full bg-[#5B7FFF] text-white text-center font-semibold py-3 rounded-xl hover:bg-[#4A6FEF] transition-colors mt-4"
                >
                  Open in Cocycle
                </a>
                <p className="text-xs text-[#9BA8B8] text-center mt-2">
                  Don&apos;t have the app? <span className="underline cursor-pointer hover:text-[#5B7FFF]">Download it here</span>
                </p>
              </div>

              {/* Members Preview */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className="text-[#1A2B4A] font-semibold mb-4">
                  Members
                  <span className="text-[#6B7A90] font-normal"> · {community.memberCount}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {members.slice(0, 8).map((member) => (
                    <Link key={member.userId} href={`/user/${member.userId}`} className="relative" title={member.name || "Member"}>
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name || "Member"}
                          className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#5B7FFF]/20 flex items-center justify-center hover:opacity-80 transition-opacity">
                          <svg className="w-5 h-5 text-[#5B7FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      {member.role === "admin" && (
                        <div className="absolute -bottom-0.5 -right-0.5 bg-[#FF8A5B] rounded-full p-0.5">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      )}
                    </Link>
                  ))}
                  {members.length > 8 && (
                    <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#6B7A90] text-xs font-medium">
                      +{members.length - 8}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Rides */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#1A2B4A] text-xl font-semibold">Rides</h2>
                <div className="flex bg-white rounded-full p-1">
                  <button
                    onClick={() => setRidesTab("upcoming")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      ridesTab === "upcoming" ? "bg-[#5B7FFF] text-white" : "text-[#6B7A90]"
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setRidesTab("past")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      ridesTab === "past" ? "bg-[#5B7FFF] text-white" : "text-[#6B7A90]"
                    }`}
                  >
                    Past
                  </button>
                </div>
              </div>

              {filteredRides.length > 0 ? (
                <div className="space-y-3">
                  {filteredRides.map((ride) => <RideCard key={ride.id} ride={ride} />)}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-[#E5E9F0]">
                  <div className="w-16 h-16 rounded-full bg-[#5B7FFF]/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#5B7FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <p className="text-[#1A2B4A] font-semibold text-lg mb-1">No {ridesTab} rides</p>
                  <p className="text-[#6B7A90]">
                    {ridesTab === "past"
                      ? "No past rides in this community yet"
                      : "Download the app to join and create rides"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}