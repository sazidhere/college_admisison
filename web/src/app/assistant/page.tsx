import type { Metadata } from "next";
import { Assistant } from "@/components/Assistant";

export const metadata: Metadata = { title: "Assistant" };

export default async function AssistantPage(props: PageProps<"/assistant">) {
  const sp = await props.searchParams;
  return <Assistant ask={sp.ask === "profile" ? "profile" : undefined} />;
}
