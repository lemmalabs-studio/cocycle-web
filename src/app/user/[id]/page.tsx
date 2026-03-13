import { Metadata } from "next";
import UserProfile from "./UserProfile";
import { API_URL } from "@/lib/constants";
import { UserProfile as UserProfileType } from "@/types/user";

type Params = Promise<{ id: string }>;

type Props = {
  params: Params;
};

async function getUserForMetadata(id: string): Promise<UserProfileType | null> {
  try {
    const res = await fetch(`${API_URL}/api/users/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await getUserForMetadata(id);

  if (!user) {
    return { title: "User not found | Cocycle" };
  }

  return {
    title: `${user.name || "Anonymous"} | Cocycle`,
    description: `View ${user.name || "this cyclist"}'s profile on Cocycle`,
    openGraph: {
      title: user.name || "Anonymous",
      description: `Cyclist on Cocycle`,
      type: "profile",
      ...(user.avatar ? { images: [{ url: user.avatar }] } : {}),
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  return <UserProfile userId={id} />;
}