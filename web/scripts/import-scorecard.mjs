// Pulls basic facts for the most selective US bachelor's colleges from the
// US government's College Scorecard API, as a starting point for growing the
// college list toward 300. Aid policy for internationals and special programs
// are NOT in Scorecard; those still need research per college.
//
// Usage (needs a free key from https://api.data.gov/signup/):
//   SCORECARD_API_KEY=xxxx node scripts/import-scorecard.mjs [count=300]
// Writes scripts/out/scorecard.json for review; nothing in the app changes.

import { mkdir, writeFile } from "node:fs/promises";

const key = process.env.SCORECARD_API_KEY;
if (!key) {
  console.error("Set SCORECARD_API_KEY (free at https://api.data.gov/signup/).");
  process.exit(1);
}
const count = Number(process.argv[2] ?? 300);

const fields = [
  "id",
  "school.name",
  "school.city",
  "school.state",
  "school.school_url",
  "school.ownership",
  "latest.admissions.admission_rate.overall",
  "latest.admissions.sat_scores.25th_percentile.critical_reading",
  "latest.admissions.sat_scores.25th_percentile.math",
  "latest.admissions.sat_scores.75th_percentile.critical_reading",
  "latest.admissions.sat_scores.75th_percentile.math",
  "latest.cost.attendance.academic_year",
  "latest.student.size",
];

const base = "https://api.data.gov/ed/collegescorecard/v1/schools";
const out = [];
for (let page = 0; out.length < count; page++) {
  const params = new URLSearchParams({
    api_key: key,
    fields: fields.join(","),
    "school.degrees_awarded.predominant": "3", // mainly bachelor's
    "school.operating": "1",
    "latest.student.size__range": "500..",
    "latest.admissions.admission_rate.overall__range": "0.01..",
    sort: "latest.admissions.admission_rate.overall:asc",
    per_page: "100",
    page: String(page),
  });
  const res = await fetch(`${base}?${params}`);
  if (!res.ok) throw new Error(`Scorecard API ${res.status}: ${await res.text()}`);
  const { results } = await res.json();
  if (!results?.length) break;
  out.push(...results);
}

const sum = (a, b) => (a != null && b != null ? a + b : null);
const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const colleges = out.slice(0, count).map((r) => ({
  scorecardId: r.id,
  slug: slugify(r["school.name"]),
  name: r["school.name"],
  city: r["school.city"],
  state: r["school.state"],
  website: r["school.school_url"] ? `https://${String(r["school.school_url"]).replace(/^https?:\/\//, "")}` : null,
  public: r["school.ownership"] === 1,
  acceptanceRate: r["latest.admissions.admission_rate.overall"],
  sat25: sum(r["latest.admissions.sat_scores.25th_percentile.critical_reading"], r["latest.admissions.sat_scores.25th_percentile.math"]),
  sat75: sum(r["latest.admissions.sat_scores.75th_percentile.critical_reading"], r["latest.admissions.sat_scores.75th_percentile.math"]),
  costOfAttendanceUSD: r["latest.cost.attendance.academic_year"],
  undergrads: r["latest.student.size"],
}));

await mkdir(new URL("./out/", import.meta.url), { recursive: true });
await writeFile(new URL("./out/scorecard.json", import.meta.url), JSON.stringify(colleges, null, 2) + "\n");
console.log(`Wrote ${colleges.length} colleges to scripts/out/scorecard.json`);
