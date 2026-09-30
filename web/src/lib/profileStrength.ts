import type { Profile } from "./types";

export type Check = { id: string; label: string; ok: boolean; href: string };

export function profileChecks(p: Profile): Check[] {
  const hasGrades = p.curriculum === "national" ? p.sscGpa !== undefined : p.oLevelAs !== undefined;
  const hasEnglish = !!(p.tests.ielts || p.tests.toefl || p.tests.det);
  return [
    { id: "grades", label: "Add your grades", ok: hasGrades, href: "/profile#academics" },
    { id: "sat", label: "Add an SAT or ACT score (or a practice score)", ok: !!(p.tests.sat || p.tests.act), href: "/profile#tests" },
    { id: "english", label: "Add an English test score", ok: hasEnglish, href: "/profile#tests" },
    { id: "activities", label: "Add at least 3 activities", ok: p.activities.length >= 3, href: "/profile#activities" },
    { id: "awards", label: "Add an award or honour", ok: p.awards.length >= 1, href: "/profile#awards" },
    { id: "majors", label: "Choose what you might study", ok: p.intendedMajors.length > 0, href: "/profile#goals" },
  ];
}

export function profileScore(p: Profile) {
  const checks = profileChecks(p);
  return Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
}
