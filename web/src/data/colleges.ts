import raw from "./colleges.json";

export type AidPolicy = "need-blind" | "need-aware" | "no-need-aid";
export type TestPolicy = "required" | "optional" | "flexible" | "blind";
export type ProgramKind = "dual-degree" | "research" | "honors" | "study-abroad" | "curriculum" | "other";

export type Program = { name: string; description: string; url: string; kind: ProgramKind };

export type College = {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  website: string;
  admissionsUrl: string | null;
  intlAidUrl: string | null;
  intlAidPolicy: AidPolicy | null;
  meetsFullNeedIntl: boolean | null;
  acceptanceRate: number | null;
  acceptanceRateYear: string | null;
  sat25: number | null;
  sat75: number | null;
  testPolicy: TestPolicy | null;
  rounds: string[];
  costOfAttendanceUSD: number | null;
  costYear: string | null;
  costBasis: string | null; // what the cost figure includes; colleges report it differently
  satYear: string | null;
  schools: { name: string; url: string | null }[];
  programs: Program[];
  notes: string;
  sources: string[];
  confidence: "high" | "medium" | "low";
  confidenceReason: string | null;
};

export const colleges = (raw as College[]).slice().sort((a, b) => a.name.localeCompare(b.name));

export function getCollege(slug: string) {
  return colleges.find((c) => c.slug === slug);
}

export const aidLabel: Record<AidPolicy, string> = {
  "need-blind": "Need-blind for internationals",
  "need-aware": "Need-aware for internationals",
  "no-need-aid": "Little or no need-based aid for internationals",
};

export const roundLabel: Record<string, string> = {
  ED: "Early Decision (binding)",
  ED2: "Early Decision II (binding)",
  EA: "Early Action",
  REA: "Restrictive Early Action",
  SCEA: "Single-Choice Early Action",
  RD: "Regular Decision",
};

export function formatRate(r: number | null) {
  if (r === null) return "—";
  const pct = r * 100;
  return `${pct < 10 ? pct.toFixed(1) : Math.round(pct)}%`;
}

export function formatUSD(n: number | null) {
  return n === null ? "—" : `$${n.toLocaleString("en-US")}`;
}
