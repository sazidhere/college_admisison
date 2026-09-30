import type { Metadata } from "next";
import { OpportunityBrowser } from "@/components/OpportunityBrowser";
import { PageIntro } from "@/components/Page";

export const metadata: Metadata = { title: "Opportunities" };

export default function OpportunitiesPage() {
  return (
    <>
      <PageIntro
        kicker="Opportunities"
        title="Opportunities most students never hear about"
        lead="Special university programs, olympiads, summer schools that give aid to international students, and free advising in Bangladesh. Every entry links to its official page."
      />
      <OpportunityBrowser />
    </>
  );
}
