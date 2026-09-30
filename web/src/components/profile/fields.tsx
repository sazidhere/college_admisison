"use client";

import type { Profile } from "@/lib/types";

export const majorOptions = [
  "Computer Science",
  "Economics",
  "Engineering",
  "Mathematics",
  "Physics",
  "Biology / Pre-med",
  "Business",
  "Political Science",
  "Public Health",
  "Environmental Science",
  "Humanities",
  "Undecided",
];

export function numOrUndef(v: string) {
  if (v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

type Setter = (patch: Partial<Profile>) => void;

export function AcademicsFields({ p, set }: { p: Profile; set: Setter }) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="label">Your curriculum</legend>
        <div className="grid sm:grid-cols-2 gap-3">
          {(
            [
              ["national", "National (SSC / HSC)"],
              ["english-medium", "English medium (O / A Level)"],
            ] as const
          ).map(([v, l]) => (
            <label key={v} className={`border p-4 cursor-pointer ${p.curriculum === v ? "border-ink bg-mist" : "border-line"}`}>
              <input type="radio" name="curriculum" className="mr-3 accent-[var(--ink)]" checked={p.curriculum === v} onChange={() => set({ curriculum: v })} />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      {p.curriculum === "national" ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <NumberField label="SSC GPA (out of 5.00)" value={p.sscGpa} min={0} max={5} step={0.01} onChange={(v) => set({ sscGpa: v })} />
          <NumberField label="HSC GPA (out of 5.00)" hint="Leave blank if you haven't taken HSC yet" value={p.hscGpa} min={0} max={5} step={0.01} onChange={(v) => set({ hscGpa: v })} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          <NumberField label="O Level: A / A* grades" value={p.oLevelAs} min={0} max={15} onChange={(v) => set({ oLevelAs: v })} />
          <NumberField label="O Level: subjects taken" value={p.oLevelTotal} min={0} max={15} onChange={(v) => set({ oLevelTotal: v })} />
          <div>
            <label className="label" htmlFor="alevel">A Level grades</label>
            <input id="alevel" className="field" placeholder="e.g. A*A*A" value={p.aLevelGrades ?? ""} onChange={(e) => set({ aLevelGrades: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  );
}

export function TestFields({ p, set }: { p: Profile; set: Setter }) {
  const t = p.tests;
  const upd = (patch: Partial<Profile["tests"]>) => set({ tests: { ...t, ...patch } });
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <NumberField label="SAT (400–1600)" value={t.sat} min={400} max={1600} step={10} onChange={(v) => upd({ sat: v })} />
      <NumberField label="ACT (1–36)" value={t.act} min={1} max={36} onChange={(v) => upd({ act: v })} />
      <NumberField label="IELTS (0–9)" value={t.ielts} min={0} max={9} step={0.5} onChange={(v) => upd({ ielts: v })} />
      <NumberField label="Duolingo English Test (10–160)" value={t.det} min={10} max={160} step={5} onChange={(v) => upd({ det: v })} />
      <NumberField label="TOEFL iBT (0–120)" value={t.toefl} min={0} max={120} onChange={(v) => upd({ toefl: v })} />
    </div>
  );
}

export function GoalFields({ p, set }: { p: Profile; set: Setter }) {
  const toggle = (m: string) =>
    set({ intendedMajors: p.intendedMajors.includes(m) ? p.intendedMajors.filter((x) => x !== m) : [...p.intendedMajors, m] });
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="label">What might you study? Pick any.</legend>
        <div className="flex flex-wrap gap-2">
          {majorOptions.map((m) => {
            const on = p.intendedMajors.includes(m);
            return (
              <button type="button" key={m} onClick={() => toggle(m)} aria-pressed={on} className={`px-4 py-2 border ${on ? "bg-ink text-paper border-ink" : "border-line hover:border-ink"}`}>
                {m}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="label">How much financial aid will your family need?</legend>
        <div className="grid sm:grid-cols-3 gap-3">
          {(
            [
              ["full", "Full or nearly full aid"],
              ["partial", "Some aid"],
              ["none", "No aid needed"],
            ] as const
          ).map(([v, l]) => (
            <label key={v} className={`border p-4 cursor-pointer ${p.needsAid === v ? "border-ink bg-mist" : "border-line"}`}>
              <input type="radio" name="aid" className="mr-3 accent-[var(--ink)]" checked={p.needsAid === v} onChange={() => set({ needsAid: v })} />
              {l}
            </label>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">This changes which colleges we highlight. It is never shared.</p>
      </fieldset>
    </div>
  );
}

export function NumberField({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  hint?: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  min: number;
  max: number;
  step?: number;
}) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  const invalid = value !== undefined && (value < min || value > max);
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} type="number" inputMode="decimal" className="field" min={min} max={max} step={step} value={value ?? ""} onChange={(e) => onChange(numOrUndef(e.target.value))} aria-invalid={invalid} />
      {invalid ? <p className="mt-1 text-sm text-signal">Should be between {min} and {max}.</p> : hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}
