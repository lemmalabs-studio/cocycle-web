import { Metadata } from "next";
import RideDetail from "./RideDetail";
import { API_URL } from "@/lib/constants";
import { RideResponse } from "@/types/ride";

type Params = Promise<{ id: string }>;

type Props = {
  params: Params;
};

// Server-side fetch for metadata only
async function getRideForMetadata(id: string): Promise<RideResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/rides/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Generate metadata for Open Graph (social sharing previews)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ride = await getRideForMetadata(id);

  if (!ride) {
    return {
      title: "Ride not found | Cocycle",
    };
  }

  const rideDate = new Date(ride.startTime);
  const formattedDate = rideDate.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return {
    title: `${ride.title} | Cocycle`,
    description: `${ride.rideType} ride on ${formattedDate} • ${(ride.distance / 1000).toFixed(1)}km • ${ride.paceMin}-${ride.paceMax}km/h`,
    openGraph: {
      title: ride.title,
      description: `Join this ${ride.rideType.toLowerCase()} ride on ${formattedDate}`,
      type: "website",
    },
  };
}

export default async function RidePage({ params }: Props) {
  const { id } = await params;

  return <RideDetail rideId={id} />;
}