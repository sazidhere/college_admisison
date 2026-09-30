"use client";

import type { College } from "@/data/colleges";
import { bandStyle, estimateChance } from "@/lib/chances";
import { useHydrated, useProfile } from "@/lib/store";

export function BandBadge({ college }: { college: College }) {
  const [profile] = useProfile();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const { band } = estimateChance(college, profile);
  const s = bandStyle[band];
  return <span className={`inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${s.cls}`}>{s.label}</span>;
}

export function ChanceCard({ college }: { college: College }) {
  const [profile] = useProfile();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const r = estimateChance(college, profile);
  const s = bandStyle[r.band];
  return (
    <div className="border border-line p-6 sm:p-8">
      <p className="uppercase tracking-[0.2em] text-sm text-muted">{profile ? "For your profile" : "In general"}</p>
      <p className="mt-3 flex items-center gap-3">
        <span className={`px-3 py-1.5 text-sm font-semibold uppercase tracking-wider ${s.cls}`}>{s.label}</span>
      </p>
      <ul className="mt-4 space-y-2 text-[0.95rem] text-ink/80">
        {r.reasons.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      {r.aidWarning && <p className="mt-4 text-warn text-[0.95rem]">{r.aidWarning}</p>}
      <p className="mt-5 text-xs text-muted leading-relaxed">
        A rough band, not a prediction. Essays, recommendations and activities matter a great deal, and we can&apos;t see
        those in numbers.
      </p>
    </div>
  );
}
