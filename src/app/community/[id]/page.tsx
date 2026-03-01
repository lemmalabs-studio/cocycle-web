import { Metadata } from "next";
import CommunityDetail from "./CommunityDetail";
import { API_URL } from "@/lib/constants";
import { CommunityResponse } from "@/types/community";

type Params = Promise<{ id: string }>;

type Props = {
  params: Params;
};

// Server-side fetch for metadata only
async function getCommunityForMetadata(id: string): Promise<CommunityResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/communities/${id}`, {
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
  const community = await getCommunityForMetadata(id);

  if (!community) {
    return {
      title: "Community not found | Cocycle",
    };
  }

  return {
    title: `${community.name} | Cocycle`,
    description: community.description || `Join ${community.name} on Cocycle - ${community.memberCount} members • ${community.type} • ${community.activityLevel} activity`,
    openGraph: {
      title: community.name,
      description: community.description || `${community.memberCount} members • ${community.type} community`,
      type: "website",
      images: community.image ? [{ url: community.image }] : undefined,
    },
  };
}

export default async function CommunityPage({ params }: Props) {
  const { id } = await params;

  return <CommunityDetail communityId={id} />;
}