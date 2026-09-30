"use client";

import Link from "next/link";
import { ArrowLink } from "@/components/ArrowLink";
import { NeedProfile } from "@/components/NeedProfile";
import { Container, PageIntro } from "@/components/Page";
import { CheckIcon } from "@/components/icons";
import { getCollege } from "@/data/colleges";
import { bandStyle, estimateChance } from "@/lib/chances";
import { profileChecks, profileScore } from "@/lib/profileStrength";
import { dueDate, formatDue, isOverdue, roadmapStatus, stages } from "@/lib/roadmap";
import { useHydrated, useList, useProfile, useRoadmapDone } from "@/lib/store";

export function Dashboard({ welcome }: { welcome: boolean }) {
  const hydrated = useHydrated();
  const [profile] = useProfile();
  const [done, setDone] = useRoadmapDone();
  const [list] = useList();

  if (!hydrated) return <PageIntro kicker="Roadmap" title="Your roadmap" />;
  if (!profile)
    return (
      <>
        <PageIntro kicker="Roadmap" title="Your roadmap" lead="Every step from class 7 to your visa interview, with dates worked out for your class." />
        <NeedProfile what="your roadmap" />
      </>
    );

  const now = new Date();
  const { overdue, next, currentStage, progress } = roadmapStatus(profile, done, now);
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const firstName = profile.name.split(" ")[0];
  const bands = list.reduce<Record<string, number>>((acc, e) => {
    const c = getCollege(e.slug);
    if (c) {
      const b = estimateChance(c, profile).band;
      acc[b] = (acc[b] ?? 0) + 1;
    }
    return acc;
  }, {});
  const missing = profileChecks(profile).filter((c) => !c.ok);

  return (
    <>
      <PageIntro
        kicker={`Class ${profile.classLevel} · Fall ${profile.gradYear} entry`}
        title={welcome ? `Welcome, ${firstName}` : `Where you are, ${firstName}`}
        lead={
          <>
            You are in the <strong>{currentStage.title}</strong> stage: {currentStage.summary}
          </>
        }
      >
        <div className="text-right">
          <p className="font-serif text-6xl">{progress}%</p>
          <p className="text-muted">of the roadmap done</p>
        </div>
      </PageIntro>

      <Container className="py-12 grid gap-8 lg:grid-cols-3">
        <div className="bg-ink text-paper p-8 flex flex-col justify-between min-h-64">
          <p className="uppercase tracking-[0.2em] text-sm text-white/60">Next step</p>
          {next ? (
            <div>
              <p className="font-serif text-3xl mt-4">{next.title}</p>
              <p className="mt-2 text-white/75">{next.detail}</p>
              <p className="mt-4 text-sm text-white/60">By {formatDue(next, profile.gradYear)}</p>
              {next.href && (
                <div className="mt-6">
                  <ArrowLink href={next.href} tone="light">Go</ArrowLink>
                </div>
              )}
            </div>
          ) : (
            <p className="font-serif text-3xl mt-4">All steps done. Well done.</p>
          )}
        </div>

        <div className="border border-line p-8">
          <p className="uppercase tracking-[0.2em] text-sm text-muted flex items-center gap-2">
            {overdue.length > 0 && <span className="size-2 rounded-full bg-signal" />}Behind schedule
          </p>
          {overdue.length === 0 ? (
            <p className="font-serif text-3xl mt-4">You are on track.</p>
          ) : (
            <>
              <p className="font-serif text-3xl mt-4">
                {overdue.length} step{overdue.length > 1 ? "s" : ""} to catch up on
              </p>
              <ul className="mt-4 space-y-2 text-[0.95rem]">
                {overdue.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />
                    {s.title}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">Already done some? Tick them off below.</p>
            </>
          )}
        </div>

        <div className="border border-line p-8">
          <p className="uppercase tracking-[0.2em] text-sm text-muted">Your college list</p>
          {list.length === 0 ? (
            <>
              <p className="font-serif text-3xl mt-4">No colleges yet</p>
              <div className="mt-6">
                <ArrowLink href="/colleges">Start your list</ArrowLink>
              </div>
            </>
          ) : (
            <>
              <p className="font-serif text-3xl mt-4">{list.length} colleges</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["reach", "target", "likely", "unknown"] as const).map((b) =>
                  bands[b] ? (
                    <span key={b} className={`px-3 py-1 text-sm font-semibold ${bandStyle[b].cls}`}>
                      {bands[b]} {bandStyle[b].label}
                    </span>
                  ) : null,
                )}
              </div>
              {!bands.likely && !bands.target && (
                <p className="mt-4 text-sm text-warn">Every college on your list is a reach. Add some targets and likely schools.</p>
              )}
              <div className="mt-6">
                <ArrowLink href="/colleges?tab=list">Open my list</ArrowLink>
              </div>
            </>
          )}
        </div>
      </Container>

      {missing.length > 0 && (
        <Container>
          <div className="bg-mist p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="uppercase tracking-[0.2em] text-sm text-muted">Profile {profileScore(profile)}% complete</p>
              <p className="font-serif text-2xl mt-2">{missing[0].label} to get better advice.</p>
            </div>
            <ArrowLink href={missing[0].href}>Update profile</ArrowLink>
          </div>
        </Container>
      )}

      <Container className="pt-16">
        <h2 className="text-5xl">The full roadmap</h2>
        <hr className="mt-8 border-t-4 border-ink" />
        {stages.map((stage) => (
          <section key={stage.id} className="grid gap-6 lg:grid-cols-[1fr_2fr] py-10 border-b border-line">
            <div>
              <h3 className="text-4xl flex items-center gap-3">
                {stage.title}
                {stage.id === currentStage.id && <span className="text-xs font-sans uppercase tracking-widest bg-ink text-paper px-2 py-1">You are here</span>}
              </h3>
              <p className="mt-2 text-muted">{stage.summary}</p>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {stage.steps.map((s) => {
                const isDone = done.includes(s.id);
                const late = !isDone && isOverdue(s, profile.gradYear, now);
                const past = !isDone && !late && dueDate(s, profile.gradYear) < now;
                return (
                  <li key={s.id} className="flex gap-4 py-4">
                    <button
                      onClick={() => toggle(s.id)}
                      aria-pressed={isDone}
                      aria-label={isDone ? `Mark "${s.title}" not done` : `Mark "${s.title}" done`}
                      className={`mt-1 grid place-items-center size-7 shrink-0 border ${isDone ? "bg-ink border-ink text-paper" : "border-ink/40 hover:border-ink"}`}
                    >
                      {isDone && <CheckIcon className="size-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${isDone ? "line-through text-muted" : ""}`}>
                        {s.href ? (
                          <Link href={s.href} className="hover:underline underline-offset-4">{s.title}</Link>
                        ) : (
                          s.title
                        )}
                      </p>
                      <p className="text-ink/70 text-[0.95rem]">{s.detail}</p>
                    </div>
                    <p className={`shrink-0 text-sm pt-1 flex items-start gap-2 ${late ? "text-signal font-semibold" : "text-muted"}`}>
                      {late && <span className="mt-1.5 size-1.5 rounded-full bg-signal" />}
                      {past ? "Earlier" : formatDue(s, profile.gradYear)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
