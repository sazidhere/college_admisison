import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = { title: "Roadmap" };

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const sp = await props.searchParams;
  return <Dashboard welcome={sp.welcome === "1"} />;
}
