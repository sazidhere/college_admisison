import type { Metadata } from "next";
import { ProfileEditor } from "@/components/profile/ProfileEditor";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return <ProfileEditor />;
}
