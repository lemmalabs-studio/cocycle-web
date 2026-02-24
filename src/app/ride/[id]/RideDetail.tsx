"use client";

import { useRide, useRideParticipants } from "@/hooks/useRideQueries";
import RideMap from "./RideMap";

interface RideDetailProps {
  rideId: string;
}

export default function RideDetail({ rideId }: RideDetailProps) {
  const { data: ride, isLoading, error } = useRide(rideId);
  const { data: participants = [] } = useRideParticipants(rideId);

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5B7FFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7A90]">Loading ride...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !ride) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1A2B4A]">Ride not found</h1>
          <p className="text-[#6B7A90] mt-2">This ride may have been deleted or doesn&apos;t exist</p>
        </div>
      </main>
    );
  }

  // Format date and time
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

  // Calculate time until ride
  const now = new Date();
  const diffMs = rideDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  let startsIn = null;
  if (diffMs > 0) {
    if (diffDays > 0) {
      startsIn = `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      startsIn = `Starts in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      startsIn = `Starts in ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    }
  }

  // Get ride type color
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

  // Format distance
  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  };

  // Parse route coordinates
  const routeCoordinates = ride.route?.coordinates || [];

  // Find host from participants
  const hostParticipant = participants.find((p) => p.isCreator);
  const otherParticipants = participants.filter((p) => !p.isCreator);

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      {/* Mobile Layout (default) */}
      <div className="lg:hidden">
        {/* Map */}
        <div className="h-[250px] bg-gray-200">
          <RideMap
            coordinates={routeCoordinates}
            startLat={ride.startLat}
            startLng={ride.startLng}
            cafeLat={ride.cafeLat}
            cafeLng={ride.cafeLng}
            hasCafe={ride.hasCafe}
          />
        </div>

        {/* Content */}
        <div className="px-5 pt-5 pb-32">
          {/* Title & Type Badge */}
          <div className="mb-3">
            <h1 className="text-[#1A2B4A] font-bold text-2xl mb-1">{ride.title}</h1>
            <div className="flex items-center gap-2">
              <span className={`${getTypeColor()} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                {ride.rideType}
              </span>
              <span className="text-[#6B7A90] text-sm">{formattedDate}</span>
            </div>
          </div>

          {/* Time with countdown */}
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-[#6B7A90]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#6B7A90] ml-2">{formattedTime}</span>
            {startsIn && (
              <span className="bg-[#5B7FFF]/10 text-[#5B7FFF] text-xs font-medium px-3 py-1 rounded-full ml-3">
                {startsIn}
              </span>
            )}
          </div>

          {/* Description */}
          {ride.description && (
            <div className="bg-white rounded-2xl p-4 mb-4">
              <p className="text-[#1A2B4A] leading-5">{ride.description}</p>
            </div>
          )}

          {/* Stats Row */}
          <div className="bg-white rounded-2xl overflow-hidden mb-4">
            <div className="flex">
              <div className="flex-1 text-center py-3 border-r border-[#E5E9F0]">
                <svg className="w-6 h-6 text-[#5B7FFF] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-[#1A2B4A] font-bold text-lg mt-1">{formatDistance(ride.distance)}</p>
                <p className="text-[#9BA8B8] text-xs">Distance</p>
              </div>
              <div className="flex-1 text-center py-3 border-r border-[#E5E9F0]">
                <svg className="w-6 h-6 text-[#5B7FFF] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-[#1A2B4A] font-bold text-lg mt-1">{ride.paceMin}-{ride.paceMax}</p>
                <p className="text-[#9BA8B8] text-xs">km/h</p>
              </div>
              <div className="flex-1 text-center py-3">
                <svg className="w-6 h-6 text-[#5B7FFF] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="text-[#1A2B4A] font-bold text-lg mt-1">{ride.currentParticipants}/{ride.maxParticipants}</p>
                <p className="text-[#9BA8B8] text-xs">Riders</p>
              </div>
            </div>
          </div>

          {/* Privacy badges */}
          {(ride.inviteOnly || ride.womenOnly) && (
            <div className="flex gap-2 mb-4">
              {ride.inviteOnly && (
                <div className="bg-white rounded-full px-4 py-2 flex items-center">
                  <svg className="w-4 h-4 text-[#6B7A90]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[#6B7A90] ml-2 text-sm">Invite Only</span>
                </div>
              )}
              {ride.womenOnly && (
                <div className="bg-white rounded-full px-4 py-2 flex items-center">
                  <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V15h2v2h-2v3h-2v-3h-2v-2h2v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 016-6z" />
                  </svg>
                  <span className="text-[#6B7A90] ml-2 text-sm">Women Only</span>
                </div>
              )}
            </div>
          )}

          {/* Meeting Point */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            <h3 className="text-[#1A2B4A] font-semibold text-lg mb-3">Meeting Point</h3>
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-[#1A2B4A] font-medium">
                  {ride.startLat.toFixed(4)}, {ride.startLng.toFixed(4)}
                </p>
                <p className="text-[#6B7A90] text-sm">Start location</p>
              </div>
            </div>
          </div>

          {/* Café Stop */}
          {ride.hasCafe && (
            <div className="bg-white rounded-2xl p-4 mb-4">
              <h3 className="text-[#1A2B4A] font-semibold text-lg mb-3">Café Stop</h3>
              <div className="flex items-center">
                <div className="bg-[#FF8A5B]/20 rounded-full p-3 mr-3">
                  <svg className="w-5 h-5 text-[#FF8A5B]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21v-2h18v2H2zm2-4v-6h14v6H4zm16-6h2v4h-2v-4zM6 3h12v2H6V3zm0 4h12v2H6V7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#1A2B4A] font-medium">{ride.cafeName || "Café Stop"}</p>
                  <p className="text-[#6B7A90] text-sm">Coffee break included ☕</p>
                </div>
              </div>
            </div>
          )}

          {/* Host */}
          <div className="mb-4">
            <h3 className="text-[#1A2B4A] font-semibold text-lg mb-3">Host</h3>
            <div className="flex items-center bg-white rounded-2xl p-3">
              {hostParticipant?.avatar || ride.creatorAvatar ? (
                <img
                  src={hostParticipant?.avatar || ride.creatorAvatar}
                  alt={hostParticipant?.name || ride.creatorName || "Host"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#5B7FFF]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#5B7FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <span className="text-[#1A2B4A] font-semibold">
                    {hostParticipant?.name || ride.creatorName || "Anonymous"}
                  </span>
                  <span className="bg-[#FF8A5B]/20 text-[#FF8A5B] text-xs font-medium px-2 py-0.5 rounded-full ml-2">
                    Host
                  </span>
                </div>
                <span className="text-[#6B7A90] text-sm">{hostParticipant?.level || "Cyclist"}</span>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[#1A2B4A] font-semibold text-lg">
                Participants ({ride.currentParticipants}/{ride.maxParticipants})
              </h3>
              {ride.currentParticipants < ride.maxParticipants && (
                <span className="text-[#6B7A90] text-sm">
                  {ride.maxParticipants - ride.currentParticipants} spots left
                </span>
              )}
            </div>

            {otherParticipants.length > 0 ? (
              <div className="space-y-2">
                {otherParticipants.map((participant) => (
                  <div key={participant.userId} className="flex items-center bg-white rounded-2xl p-3">
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name || "Participant"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#5B7FFF]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#5B7FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="ml-3 flex-1">
                      <span className="text-[#1A2B4A] font-semibold">{participant.name || "Anonymous"}</span>
                      <p className="text-[#6B7A90] text-sm">{participant.level || "Cyclist"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center">
                <svg className="w-10 h-10 text-[#9BA8B8] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="text-[#6B7A90] mt-2">Be the first to join this ride!</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar - Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E9F0] p-4 lg:hidden">
          <a
            href={`cocycle://ride/${ride.id}`}
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
      <div className="hidden lg:flex min-h-screen">
        {/* Left side - Map */}
        <div className="w-1/2 h-screen sticky top-0">
          <RideMap
            coordinates={routeCoordinates}
            startLat={ride.startLat}
            startLng={ride.startLng}
            cafeLat={ride.cafeLat}
            cafeLng={ride.cafeLng}
            hasCafe={ride.hasCafe}
          />
        </div>

        {/* Right side - Content */}
        <div className="w-1/2 p-8 overflow-y-auto">
          <div className="max-w-lg mx-auto">
            {/* Logo / Brand */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#5B7FFF] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#1A2B4A]">Cocycle</span>
            </div>

            {/* Title & Type Badge */}
            <div className="mb-4">
              <h1 className="text-[#1A2B4A] font-bold text-3xl mb-2">{ride.title}</h1>
              <div className="flex items-center gap-2">
                <span className={`${getTypeColor()} text-white text-sm font-semibold px-4 py-1.5 rounded-full`}>
                  {ride.rideType}
                </span>
                {startsIn && (
                  <span className="bg-[#5B7FFF]/10 text-[#5B7FFF] text-sm font-medium px-4 py-1.5 rounded-full">
                    {startsIn}
                  </span>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-4 mb-6 text-[#6B7A90]">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formattedTime}
              </div>
            </div>

            {/* Description */}
            {ride.description && (
              <p className="text-[#1A2B4A] leading-relaxed mb-6">{ride.description}</p>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 text-center">
                <svg className="w-6 h-6 text-[#5B7FFF] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <p className="text-[#1A2B4A] font-bold text-xl">{formatDistance(ride.distance)}</p>
                <p className="text-[#9BA8B8] text-sm">Distance</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center">
                <svg className="w-6 h-6 text-[#5B7FFF] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-[#1A2B4A] font-bold text-xl">{ride.paceMin}-{ride.paceMax}</p>
                <p className="text-[#9BA8B8] text-sm">km/h</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center">
                <svg className="w-6 h-6 text-[#5B7FFF] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="text-[#1A2B4A] font-bold text-xl">{ride.currentParticipants}/{ride.maxParticipants}</p>
                <p className="text-[#9BA8B8] text-sm">Riders</p>
              </div>
            </div>

            {/* Host Card */}
            <div className="bg-white rounded-2xl p-4 mb-6">
              <div className="flex items-center">
                {hostParticipant?.avatar || ride.creatorAvatar ? (
                  <img
                    src={hostParticipant?.avatar || ride.creatorAvatar}
                    alt={hostParticipant?.name || ride.creatorName || "Host"}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#5B7FFF]/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#5B7FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="ml-4">
                  <p className="text-[#6B7A90] text-sm">Hosted by</p>
                  <p className="text-[#1A2B4A] font-semibold text-lg">
                    {hostParticipant?.name || ride.creatorName || "Anonymous"}
                  </p>
                </div>
              </div>
            </div>

            {/* Café Stop */}
            {ride.hasCafe && (
              <div className="bg-white rounded-2xl p-4 mb-6 flex items-center">
                <div className="bg-[#FF8A5B]/20 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-[#FF8A5B]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21v-2h18v2H2zm2-4v-6h14v6H4zm16-6h2v4h-2v-4zM6 3h12v2H6V3zm0 4h12v2H6V7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#1A2B4A] font-semibold">{ride.cafeName || "Café Stop"}</p>
                  <p className="text-[#6B7A90] text-sm">Coffee break included ☕</p>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <a
              href={`cocycle://ride/${ride.id}`}
              className="block w-full bg-[#5B7FFF] text-white text-center font-bold text-lg py-4 rounded-full hover:bg-[#4A6FEF] transition-colors mb-3"
            >
              Open in Cocycle
            </a>
            <p className="text-sm text-[#9BA8B8] text-center">
              Don&apos;t have the app? <span className="underline cursor-pointer hover:text-[#5B7FFF]">Download it here</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}