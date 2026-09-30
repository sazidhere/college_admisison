import raw from "./opportunities.json";

export type OpportunityCategory = "olympiad" | "summer" | "competition" | "scholarship" | "advising" | "test";

export type Opportunity = {
  id: string;
  name: string;
  org: string;
  category: OpportunityCategory;
  description: string;
  eligibility: string;
  cost: string;
  deadlineHint: string | null;
  url: string;
  tags: string[];
  classLevels: number[];
  sources: string[];
  confidence: "high" | "medium" | "low";
};

export const opportunities = raw as Opportunity[];

export const categoryLabel: Record<OpportunityCategory, string> = {
  olympiad: "Olympiads in Bangladesh",
  summer: "Summer programs",
  competition: "Competitions",
  scholarship: "Scholarships & funds",
  advising: "Free advising",
  test: "Test prep",
};
