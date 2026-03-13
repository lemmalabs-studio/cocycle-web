"use client";

import { useRide, useRideParticipants } from "@/hooks/useRideQueries";
import RideMap from "./RideMap";

interface RideDetailProps {
  rideId: string;
}

export default function RideDetail({ rideId }: RideDetailProps) {
  const { data: ride, isLoading, error } = useRide(rideId);
  const { data: participants = [] } = useRideParticipants(rideId);

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA]">
        {/* Map skeleton */}
        <div className="h-[320px] lg:h-screen lg:w-1/2 lg:fixed lg:top-0 lg:left-0 bg-gray-200 animate-pulse" />

        {/* Content skeleton — card overlapping map */}
        <div
          className="relative bg-[#F5F7FA] px-6 pt-6 lg:ml-[50%] lg:mt-0 lg:pt-10 lg:px-10"
          style={{
            marginTop: -50,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        >
          <div className="max-w-lg mx-auto lg:max-w-none pt-4 space-y-5 animate-pulse">
            <div className="flex items-center gap-3 pt-2">
              <div className="h-7 w-48 bg-gray-200 rounded-lg" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>
            <div className="h-4 w-56 bg-gray-200 rounded" />
            <div className="flex gap-4 mt-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-1 h-12 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-4/5 bg-gray-200 rounded" />
            <div className="flex items-center gap-3 mt-4">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-48 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Error / Not Found ─────────────────────────────────────────────────────
  if (error || !ride) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1A2B4A]">Ride not found</h1>
          <p className="text-[#6B7A90] mt-2">
            This ride may have been deleted or doesn&apos;t exist
          </p>
        </div>
      </main>
    );
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const rideDate = new Date(ride.startTime);
  const formattedDate = rideDate.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formattedTime = rideDate.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const now = new Date();
  const diffMs = rideDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  let startsIn: string | null = null;
  if (diffMs > 0) {
    if (diffDays > 0)
      startsIn = `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    else if (diffHours > 0)
      startsIn = `Starts in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      startsIn = `Starts in ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    }
  }

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

  const routeCoordinates = ride.route?.coordinates || [];
  const hostParticipant = participants.find((p) => p.isCreator);
  const otherParticipants = participants.filter((p) => !p.isCreator);

  // Initials helper
  const initials = (name?: string | null) =>
    (name || "?")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // ─── Shared content (used in both mobile and desktop panels) ───────────────
  // Plain JSX variable — avoids "component created during render" error
  const contentPanel = (
    <div className="px-8 pt-6 pb-36 lg:pb-10">
      {/* Title & Type Badge — same row as mobile */}
      <div className="flex items-center gap-3 pt-5 mb-1 flex-wrap">
        <h1 className="text-[#1A2B4A] font-bold text-2xl lg:text-3xl">
          {ride.title}
        </h1>
        <span
          className={`${getTypeColor()} text-white text-xs font-semibold px-3 py-1 rounded-full`}
        >
          {ride.rideType}
        </span>
      </div>

      {/* Date & time — single muted line, with "Starts in" inline */}
      <p className="text-[#6B7A90] text-sm mb-5">
        {formattedDate} at {formattedTime}
        {startsIn && (
          <span className="text-[#6B7A90]">
            {"  ·  "}
            {startsIn}
          </span>
        )}
      </p>

      {/* Stats Row — flat with hairline dividers, matching mobile exactly */}
      <div className="flex items-center mb-6">
        <div className="flex-1 text-center">
          <p className="text-[#9BA8B8] text-xs mb-0.5">Distance</p>
          <p className="text-[#1A2B4A] font-semibold text-base">
            {formatDistance(ride.distance)}
          </p>
        </div>
        <div className="w-px h-8 bg-[#E5E9F0]" />
        <div className="flex-1 text-center">
          <p className="text-[#9BA8B8] text-xs mb-0.5">Pace</p>
          <p className="text-[#1A2B4A] font-semibold text-base">
            {ride.paceMin}–{ride.paceMax} km/h
          </p>
        </div>
        <div className="w-px h-8 bg-[#E5E9F0]" />
        <div className="flex-1 text-center">
          <p className="text-[#9BA8B8] text-xs mb-0.5">Riders</p>
          <p className="text-[#1A2B4A] font-semibold text-base">
            {ride.currentParticipants}
            {ride.maxParticipants > 0 ? `/${ride.maxParticipants}` : ""}
          </p>
        </div>
      </div>

      {/* Description — inline, no card, matching mobile */}
      {ride.description && (
        <p className="text-[#1A2B4A] leading-6 mb-6">{ride.description}</p>
      )}

      {/* Privacy badges */}
      {(ride.inviteOnly || ride.womenOnly) && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {ride.inviteOnly && (
            <div className="bg-white rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-sm">
              <svg
                className="w-4 h-4 text-[#6B7A90]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-[#6B7A90] text-sm">Invite Only</span>
            </div>
          )}
          {ride.womenOnly && (
            <div className="bg-white rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-sm">
              <svg
                className="w-4 h-4 text-pink-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V15h2v2h-2v3h-2v-3h-2v-2h2v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 016-6z" />
              </svg>
              <span className="text-[#6B7A90] text-sm">Women Only</span>
            </div>
          )}
        </div>
      )}

      {/* Café Stop — icon-box row card, matching mobile */}
      {ride.hasCafe && (
        <div className="bg-white rounded-2xl p-4 mb-4">
          <p className="text-[#1A2B4A] font-bold text-lg mb-3">Café Stop</p>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-[#FF8A5B]/20 flex items-center justify-center mr-3 shrink-0">
              {/* coffee cup icon */}
              <svg
                className="w-6 h-6 text-[#FF8A5B]"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 1v2M10 1v2M14 1v2"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[#1A2B4A] font-semibold">
                {ride.cafeName || "Café Stop"}
              </p>
              <p className="text-[#6B7A90] text-sm">
                Tap marker on map to view
              </p>
            </div>
            <svg
              className="w-5 h-5 text-[#9BA8B8]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Meeting Point — icon-box row card */}
      <div className="bg-white rounded-2xl p-4 mb-4">
        <p className="text-[#1A2B4A] font-bold text-lg mb-3">Meeting Point</p>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3 shrink-0">
            <svg
              className="w-6 h-6 text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[#1A2B4A] font-medium">Start location</p>
            <p className="text-[#6B7A90] text-sm">
              {ride.startLat.toFixed(4)}, {ride.startLng.toFixed(4)}
            </p>
          </div>
          <svg
            className="w-5 h-5 text-[#9BA8B8]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Host section */}
      <div className="mb-6">
        <p className="text-[#1A2B4A] font-bold text-xl mb-3">Host</p>
        <div className="flex items-center">
          {hostParticipant?.avatar || ride.creatorAvatar ? (
            <img
              src={hostParticipant?.avatar || ride.creatorAvatar}
              alt={hostParticipant?.name || ride.creatorName || "Host"}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#5B7FFF] flex items-center justify-center">
              <span className="text-white font-bold text-base">
                {initials(hostParticipant?.name || ride.creatorName)}
              </span>
            </div>
          )}
          <div className="ml-3 flex-1">
            <p className="text-[#1A2B4A] font-semibold text-base">
              {hostParticipant?.name || ride.creatorName || "Anonymous"}
            </p>
            <p className="text-[#6B7A90] text-sm">
              {hostParticipant?.level || "Cyclist"}
            </p>
          </div>
        </div>
      </div>

      {/* Participants section */}
      <div className="mb-6">
        <p className="text-[#1A2B4A] font-bold text-xl mb-3">
          Participants ({ride.currentParticipants}
          {ride.maxParticipants > 0 ? `/${ride.maxParticipants}` : ""})
        </p>

        {otherParticipants.length > 0 ? (
          <div className="space-y-4">
            {otherParticipants.map((participant) => (
              <div key={participant.userId} className="flex items-center">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name || "Participant"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#5B7FFF] flex items-center justify-center">
                    <span className="text-white font-bold text-base">
                      {initials(participant.name)}
                    </span>
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <p className="text-[#1A2B4A] font-semibold text-base">
                    {participant.name || "Anonymous"}
                  </p>
                  <p className="text-[#6B7A90] text-sm">
                    {participant.level || "Cyclist"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#6B7A90]">Be the first to join this ride!</p>
        )}
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      {/* ── MOBILE layout (< lg) ── */}
      <div className="lg:hidden">
        {/* Full-bleed map */}
        <div className="h-[320px]">
          <RideMap
            coordinates={routeCoordinates}
            startLat={ride.startLat}
            startLng={ride.startLng}
            cafeLat={ride.cafeLat}
            cafeLng={ride.cafeLng}
            hasCafe={ride.hasCafe}
          />
        </div>

        {/* Content card overlapping the map — mirrors mobile -50 / rounded-50 */}
        <div
          className="bg-[#F5F7FA] relative"
          style={{
            marginTop: -50,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        >
          {contentPanel}
        </div>

        {/* Fixed bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E9F0] px-5 py-4">
          <a
            href={`cocycle://ride/${ride.id}`}
            className="block w-full bg-[#5B7FFF] text-white text-center font-bold text-lg py-4 rounded-full hover:bg-[#4A6FEF] transition-colors"
          >
            Open in Cocycle
          </a>
          <p className="text-xs text-[#9BA8B8] text-center mt-2">
            Don&apos;t have the app?{" "}
            <span className="underline cursor-pointer hover:text-[#5B7FFF]">
              Download it here
            </span>
          </p>
        </div>
      </div>

      {/* ── DESKTOP layout (≥ lg): sticky half-map, scrollable content panel ── */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left — sticky map */}
        <div className="w-1/2 h-screen sticky top-0 shrink-0">
          <RideMap
            coordinates={routeCoordinates}
            startLat={ride.startLat}
            startLng={ride.startLng}
            cafeLat={ride.cafeLat}
            cafeLng={ride.cafeLng}
            hasCafe={ride.hasCafe}
          />
        </div>

        {/* Right — scrollable content, same card feel as mobile */}
        <div className="w-1/2 overflow-y-auto bg-[#F5F7FA]">
          {/* Brand header */}
          <div className="flex items-center gap-2 px-8 pt-8 mb-2">
            <div className="w-9 h-9 bg-[#5B7FFF] rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1A2B4A]">Cocycle</span>
          </div>

          {contentPanel}

          {/* Desktop CTA */}
          <div className="px-8 pb-10">
            <a
              href={`cocycle://ride/${ride.id}`}
              className="block w-full bg-[#5B7FFF] text-white text-center font-bold text-lg py-4 rounded-full hover:bg-[#4A6FEF] transition-colors mb-3"
            >
              Open in Cocycle
            </a>
            <p className="text-sm text-[#9BA8B8] text-center">
              Don&apos;t have the app?{" "}
              <span className="underline cursor-pointer hover:text-[#5B7FFF]">
                Download it here
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
