import type { Metadata } from "next";
import { CollegeBrowser } from "@/components/colleges/CollegeBrowser";

export const metadata: Metadata = { title: "Colleges" };

export default async function CollegesPage(props: PageProps<"/colleges">) {
  const sp = await props.searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  return <CollegeBrowser initialQuery={one(sp.q)} initialTab={one(sp.tab) === "list" ? "list" : "all"} initialAid={one(sp.aid)} />;
}
