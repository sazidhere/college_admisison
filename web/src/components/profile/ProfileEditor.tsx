"use client";

import { useState } from "react";
import { ArrowLink } from "@/components/ArrowLink";
import { NeedProfile } from "@/components/NeedProfile";
import { Button, Container, PageIntro } from "@/components/Page";
import { CheckIcon } from "@/components/icons";
import { profileChecks, profileScore } from "@/lib/profileStrength";
import { gradYearFor } from "@/lib/roadmap";
import { newId, useHydrated, useProfile } from "@/lib/store";
import type { Activity, Award, Profile } from "@/lib/types";
import { AcademicsFields, GoalFields, TestFields } from "./fields";

// Common App limits, so what students write here can be pasted straight in.
const MAX_ACTIVITIES = 10;
const MAX_AWARDS = 5;
const DESC_LIMIT = 150;

export function ProfileEditor() {
  const hydrated = useHydrated();
  const [profile, setProfile] = useProfile();
  if (!hydrated) return <PageIntro kicker="Profile" title="Your profile" />;
  if (!profile)
    return (
      <>
        <PageIntro kicker="Profile" title="Your profile" />
        <NeedProfile what="and edit your profile" />
      </>
    );

  const set = (patch: Partial<Profile>) => setProfile((p) => (p ? { ...p, ...patch } : p));
  const score = profileScore(profile);
  const checks = profileChecks(profile);

  return (
    <>
      <PageIntro kicker="Profile" title={profile.name} lead="Everything here saves automatically. The assistant reads it to give you advice that fits you.">
        <div className="text-right">
          <p className="font-serif text-6xl">{score}%</p>
          <p className="text-muted">complete</p>
        </div>
      </PageIntro>

      <Container className="py-12 grid gap-12 lg:grid-cols-[1fr_2.4fr]">
        <aside className="lg:sticky lg:top-36 self-start space-y-8">
          <ul className="space-y-3">
            {checks.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <span className={`grid place-items-center size-6 shrink-0 rounded-full ${c.ok ? "bg-ink text-paper" : "border border-ink/30"}`}>
                  {c.ok && <CheckIcon className="size-3.5" />}
                </span>
                <a href={c.href} className={c.ok ? "text-muted" : "hover:underline underline-offset-4"}>{c.label}</a>
              </li>
            ))}
          </ul>
          <ArrowLink href="/assistant?ask=profile">Ask the assistant how to strengthen my profile</ArrowLink>
        </aside>

        <div className="space-y-16">
          <Section id="about" title="About you">
            <div className="grid sm:grid-cols-2 gap-4">
              <Text label="Name" value={profile.name} onChange={(v) => set({ name: v })} />
              <Text label="Email" value={profile.email} onChange={(v) => set({ email: v.toLowerCase() })} />
              <div>
                <label className="label" htmlFor="p-class">Class</label>
                <select id="p-class" className="field" value={profile.classLevel} onChange={(e) => { const c = Number(e.target.value); set({ classLevel: c, gradYear: gradYearFor(c) }); }}>
                  {[7, 8, 9, 10, 11, 12].map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <Text label="Graduation year" value={String(profile.gradYear)} onChange={(v) => Number(v) && set({ gradYear: Number(v) })} />
              <Text label="City or district" value={profile.city} onChange={(v) => set({ city: v })} />
            </div>
          </Section>

          <Section id="academics" title="Academics">
            <AcademicsFields p={profile} set={set} />
          </Section>

          <Section id="tests" title="Tests">
            <TestFields p={profile} set={set} />
          </Section>

          <Section id="activities" title={`Activities (${profile.activities.length}/${MAX_ACTIVITIES})`}>
            <p className="text-ink/75 -mt-2 mb-6">Clubs, sports, jobs, family responsibilities, projects, volunteering. List the most important first.</p>
            <ActivityList items={profile.activities} onChange={(activities) => set({ activities })} />
          </Section>

          <Section id="awards" title={`Honours & awards (${profile.awards.length}/${MAX_AWARDS})`}>
            <AwardList items={profile.awards} onChange={(awards) => set({ awards })} />
          </Section>

          <Section id="goals" title="Goals">
            <GoalFields p={profile} set={set} />
          </Section>
        </div>
      </Container>
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-36">
      <h2 className="text-4xl border-b-4 border-ink pb-4 mb-8">{title}</h2>
      {children}
    </section>
  );
}

function Text({ label, value, onChange, max }: { label: string; value: string; onChange: (v: string) => void; max?: number }) {
  const id = `f-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} className="field" value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

const emptyActivity = (): Activity => ({ id: newId(), title: "", role: "", years: "", description: "" });

function ActivityList({ items, onChange }: { items: Activity[]; onChange: (a: Activity[]) => void }) {
  const [draft, setDraft] = useState<Activity | null>(null);
  const save = (a: Activity) => {
    onChange(items.some((x) => x.id === a.id) ? items.map((x) => (x.id === a.id ? a : x)) : [...items, a]);
    setDraft(null);
  };
  return (
    <div className="space-y-4">
      {items.map((a, i) =>
        draft?.id === a.id ? (
          <ActivityForm key={a.id} value={draft} onChange={setDraft} onSave={save} onCancel={() => setDraft(null)} />
        ) : (
          <div key={a.id} className="border border-line p-5 flex gap-4">
            <span className="font-serif text-3xl text-muted w-8">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{a.role ? `${a.role}, ` : ""}{a.title}</p>
              <p className="text-sm text-muted">{[a.years, a.hoursPerWeek ? `${a.hoursPerWeek} hrs/week` : ""].filter(Boolean).join(" · ")}</p>
              <p className="mt-2 text-ink/80">{a.description}</p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <button className="underline underline-offset-4" onClick={() => setDraft(a)}>Edit</button>
              <button className="underline underline-offset-4 text-muted hover:text-signal" onClick={() => onChange(items.filter((x) => x.id !== a.id))}>Remove</button>
              {i > 0 && (
                <button className="underline underline-offset-4 text-muted" onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}>Move up</button>
              )}
            </div>
          </div>
        ),
      )}
      {draft && !items.some((x) => x.id === draft.id) && (
        <ActivityForm value={draft} onChange={setDraft} onSave={save} onCancel={() => setDraft(null)} />
      )}
      {!draft && items.length < MAX_ACTIVITIES && (
        <Button variant="outline" onClick={() => setDraft(emptyActivity())}>Add an activity</Button>
      )}
    </div>
  );
}

function ActivityForm({ value, onChange, onSave, onCancel }: { value: Activity; onChange: (a: Activity) => void; onSave: (a: Activity) => void; onCancel: () => void }) {
  const upd = (patch: Partial<Activity>) => onChange({ ...value, ...patch });
  return (
    <form className="bg-mist p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); if (value.title.trim()) onSave(value); }}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Text label="Activity or organisation" value={value.title} max={100} onChange={(v) => upd({ title: v })} />
        <Text label="Your role" value={value.role} max={50} onChange={(v) => upd({ role: v })} />
        <Text label="When (e.g. Class 9–11)" value={value.years} onChange={(v) => upd({ years: v })} />
        <div>
          <label className="label" htmlFor="hrs">Hours per week</label>
          <input id="hrs" type="number" min={0} max={80} className="field" value={value.hoursPerWeek ?? ""} onChange={(e) => upd({ hoursPerWeek: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="desc">What you did and what changed because of you</label>
        <textarea id="desc" className="field min-h-24" maxLength={DESC_LIMIT} value={value.description} onChange={(e) => upd({ description: e.target.value })} />
        <p className="text-sm text-muted text-right">{value.description.length}/{DESC_LIMIT} characters (Common App limit)</p>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={!value.title.trim()}>Save</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function AwardList({ items, onChange }: { items: Award[]; onChange: (a: Award[]) => void }) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<Award["level"]>("national");
  return (
    <div className="space-y-4">
      <ul className="divide-y divide-line border-y border-line">
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-between py-4 gap-4">
            <span><span className="font-semibold">{a.title}</span> <span className="text-muted text-sm capitalize">· {a.level}</span></span>
            <button className="text-sm underline underline-offset-4 text-muted hover:text-signal" onClick={() => onChange(items.filter((x) => x.id !== a.id))}>Remove</button>
          </li>
        ))}
        {items.length === 0 && <li className="py-4 text-muted">No awards yet. Olympiad rounds, competitions and school prizes all count.</li>}
      </ul>
      {items.length < MAX_AWARDS && (
        <form
          className="grid sm:grid-cols-[2fr_1fr_auto] gap-3 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            onChange([...items, { id: newId(), title: title.trim(), level }]);
            setTitle("");
          }}
        >
          <Text label="Award" value={title} max={100} onChange={setTitle} />
          <div>
            <label className="label" htmlFor="lvl">Level</label>
            <select id="lvl" className="field" value={level} onChange={(e) => setLevel(e.target.value as Award["level"])}>
              <option value="school">School</option>
              <option value="district">District / regional</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
          </div>
          <Button type="submit" variant="outline" disabled={!title.trim()}>Add</Button>
        </form>
      )}
    </div>
  );
}
