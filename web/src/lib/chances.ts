import type { College } from "@/data/colleges";
import type { Profile } from "./types";

export type Band = "reach" | "target" | "likely" | "unknown";

export type ChanceResult = {
  band: Band;
  reasons: string[];
  aidWarning?: string;
};

const order: Band[] = ["likely", "target", "reach"];
const harder = (b: Band): Band => (b === "unknown" ? b : order[Math.min(order.indexOf(b) + 1, order.length - 1)]);

// Deliberately coarse. We never show a percentage: for international
// applicants who need aid, nobody can predict one honestly.
export function estimateChance(college: College, profile: Profile | null): ChanceResult {
  const reasons: string[] = [];
  const rate = college.acceptanceRate;
  if (rate === null) return { band: "unknown", reasons: ["We don't have this college's admit rate yet."] };

  let band: Band;
  if (rate < 0.15) {
    band = "reach";
    reasons.push(`Admits about ${Math.round(rate * 1000) / 10}% of applicants. That is a reach for every applicant, however strong.`);
  } else {
    const sat = profile?.tests.sat;
    let academic: "above" | "within" | "below" | "none" = "none";
    if (sat && college.sat25 && college.sat75) {
      academic = sat >= college.sat75 ? "above" : sat >= college.sat25 ? "within" : "below";
    }
    if (rate < 0.35) band = academic === "above" ? "target" : "reach";
    else band = academic === "above" ? "likely" : academic === "within" ? "target" : academic === "below" ? "reach" : "target";

    if (academic === "above") reasons.push(`Your SAT is at or above this college's 75th percentile (${college.sat75}).`);
    if (academic === "within") reasons.push(`Your SAT is within its middle 50% (${college.sat25}–${college.sat75}).`);
    if (academic === "below") reasons.push(`Your SAT is below its middle 50% (${college.sat25}–${college.sat75}).`);
    if (academic === "none") reasons.push("Add an SAT score to your profile for a sharper estimate.");
  }

  let aidWarning: string | undefined;
  if (profile && profile.needsAid !== "none") {
    if (college.intlAidPolicy === "need-aware") {
      const before = band;
      band = harder(band);
      if (band !== before) reasons.push("Need-aware for internationals: asking for aid makes admission harder here.");
      else reasons.push("Need-aware for internationals: asking for aid can make admission harder.");
    }
    if (college.intlAidPolicy === "no-need-aid") {
      aidWarning = "This college gives internationals little or no need-based aid. Plan for merit scholarships or other funding.";
    } else if (college.meetsFullNeedIntl === false) {
      aidWarning = "Does not promise to meet full need for internationals. Check what aid admitted students actually get.";
    }
  }
  return { band, reasons, aidWarning };
}

export const bandStyle: Record<Band, { label: string; cls: string }> = {
  reach: { label: "Reach", cls: "bg-[#fde8ec] text-[#9b0020]" },
  target: { label: "Target", cls: "bg-warn-soft text-warn" },
  likely: { label: "Likely", cls: "bg-accent-soft text-accent" },
  unknown: { label: "Unknown", cls: "bg-stone text-muted" },
};
