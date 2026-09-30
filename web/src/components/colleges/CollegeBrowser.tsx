"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Container, PageIntro } from "@/components/Page";
import { aidLabel, colleges, formatRate, getCollege, roundLabel } from "@/data/colleges";
import { useHydrated, useList } from "@/lib/store";
import type { AppStatus, ListEntry } from "@/lib/types";
import { AddToList } from "./AddToList";
import { BandBadge } from "./BandBadge";

type Tab = "all" | "list";
type AidFilter = "" | "need-blind" | "full-need" | "need-aware";
type Sort = "name" | "rate";

const statusLabel: Record<AppStatus, string> = {
  researching: "Researching",
  applying: "Applying",
  submitted: "Submitted",
  admitted: "Admitted",
  waitlisted: "Waitlisted",
  denied: "Denied",
};

export function CollegeBrowser({ initialQuery, initialTab, initialAid }: { initialQuery: string; initialTab: Tab; initialAid: string }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [list] = useList();
  const hydrated = useHydrated();

  return (
    <>
      <PageIntro
        kicker="Colleges"
        title={tab === "list" ? "My college list" : "Find your colleges"}
        lead="Aid policy for international students comes first here, because for most families in Bangladesh it decides everything."
      />
      <Container>
        <div role="tablist" className="flex gap-8 border-b border-line mt-8">
          {(
            [
              ["all", `All colleges (${colleges.length})`],
              ["list", `My list${hydrated ? ` (${list.length})` : ""}`],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              role="tab"
              aria-selected={tab === v}
              onClick={() => setTab(v)}
              className={`pb-3 -mb-px text-lg border-b-2 ${tab === v ? "border-ink font-semibold" : "border-transparent text-muted hover:text-ink"}`}
            >
              {l}
            </button>
          ))}
        </div>
        {tab === "all" ? <AllColleges initialQuery={initialQuery} initialAid={initialAid as AidFilter} /> : <MyList onBrowse={() => setTab("all")} />}
      </Container>
    </>
  );
}

function AllColleges({ initialQuery, initialAid }: { initialQuery: string; initialAid: AidFilter }) {
  const [q, setQ] = useState(initialQuery);
  const [aid, setAid] = useState<AidFilter>(initialAid);
  const [sort, setSort] = useState<Sort>("name");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = colleges.filter((c) => {
      if (term && !`${c.name} ${c.shortName} ${c.city} ${c.state} ${c.programs.map((p) => p.name).join(" ")}`.toLowerCase().includes(term)) return false;
      if (aid === "need-blind") return c.intlAidPolicy === "need-blind";
      if (aid === "need-aware") return c.intlAidPolicy === "need-aware";
      if (aid === "full-need") return c.meetsFullNeedIntl === true;
      return true;
    });
    return sort === "rate" ? filtered.sort((a, b) => (a.acceptanceRate ?? 1) - (b.acceptanceRate ?? 1)) : filtered;
  }, [q, aid, sort]);

  return (
    <div className="py-8">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label htmlFor="cq" className="label">Search</label>
          <input id="cq" className="field" placeholder="College, city, state or program" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label htmlFor="aid" className="label">Aid for internationals</label>
          <select id="aid" className="field" value={aid} onChange={(e) => setAid(e.target.value as AidFilter)}>
            <option value="">Any</option>
            <option value="need-blind">Need-blind</option>
            <option value="full-need">Meets full need</option>
            <option value="need-aware">Need-aware</option>
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="label">Sort by</label>
          <select id="sort" className="field" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="name">Name</option>
            <option value="rate">Most selective first</option>
          </select>
        </div>
      </div>

      <p className="mt-6 text-muted">{rows.length} colleges</p>
      <ul className="mt-2 border-t-4 border-ink">
        {rows.map((c) => (
          <li key={c.slug} className="grid grid-cols-[1fr_auto] md:grid-cols-[2.2fr_1fr_1.6fr_auto] gap-x-6 gap-y-2 items-center py-5 border-b border-line">
            <div className="min-w-0">
              <Link href={`/colleges/${c.slug}`} className="font-serif text-2xl sm:text-3xl hover:underline underline-offset-4">
                {c.name}
              </Link>
              <p className="text-muted text-sm mt-1">
                {c.city}, {c.state}
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-2xl font-serif">{formatRate(c.acceptanceRate)}</p>
              <p className="text-xs text-muted">admit rate</p>
            </div>
            <div className="col-span-2 md:col-span-1 row-start-2 md:row-start-auto flex flex-wrap items-center gap-2 text-sm">
              <span className="md:hidden font-serif text-lg mr-2">{formatRate(c.acceptanceRate)} admit</span>
              {c.intlAidPolicy && (
                <span className={`px-2 py-1 ${c.intlAidPolicy === "need-blind" ? "bg-accent-soft text-accent font-semibold" : "bg-stone"}`}>
                  {c.intlAidPolicy === "need-blind" ? "Need-blind" : c.intlAidPolicy === "need-aware" ? "Need-aware" : "Limited aid"}
                </span>
              )}
              {c.meetsFullNeedIntl && <span className="px-2 py-1 bg-stone">Full need</span>}
              <BandBadge college={c} />
            </div>
            <div className="row-start-1 col-start-2 md:row-start-auto md:col-start-auto">
              <AddToList slug={c.slug} compact />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted max-w-3xl">
        Starting with {colleges.length} colleges that matter most to students needing aid. More are being added. Numbers come
        from each college&apos;s official pages and Common Data Set; always confirm on the college website.
      </p>
    </div>
  );
}

function MyList({ onBrowse }: { onBrowse: () => void }) {
  const [list, setList] = useList();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const update = (slug: string, patch: Partial<ListEntry>) => setList((l) => l.map((e) => (e.slug === slug ? { ...e, ...patch } : e)));

  if (list.length === 0)
    return (
      <div className="py-16 max-w-xl">
        <p className="font-serif text-4xl">Your list is empty</p>
        <p className="mt-3 text-ink/75">Add colleges from the full list. A good list has 12–20 colleges across reach, target and likely.</p>
        <button onClick={onBrowse} className="mt-6 underline underline-offset-4 font-semibold">Browse colleges</button>
      </div>
    );

  return (
    <div className="py-8 overflow-x-auto">
      <table className="w-full min-w-[860px] text-left">
        <thead>
          <tr className="border-b-4 border-ink text-sm text-muted">
            <th className="py-3 font-semibold">College</th>
            <th className="py-3 font-semibold">Band</th>
            <th className="py-3 font-semibold">Status</th>
            <th className="py-3 font-semibold">Round</th>
            <th className="py-3 font-semibold text-center">Essays</th>
            <th className="py-3 font-semibold text-center">Aid forms</th>
            <th className="py-3 font-semibold">Aid policy</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody>
          {list.map((e) => {
            const c = getCollege(e.slug);
            if (!c) return null;
            return (
              <tr key={e.slug} className="border-b border-line align-middle">
                <td className="py-4 pr-4">
                  <Link href={`/colleges/${c.slug}`} className="font-serif text-2xl hover:underline underline-offset-4">{c.shortName}</Link>
                  <p className="text-xs text-muted">{formatRate(c.acceptanceRate)} admit</p>
                </td>
                <td className="py-4 pr-4"><BandBadge college={c} /></td>
                <td className="py-4 pr-4">
                  <select aria-label={`Status for ${c.shortName}`} className="field !py-2" value={e.status} onChange={(ev) => update(e.slug, { status: ev.target.value as AppStatus })}>
                    {Object.entries(statusLabel).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </td>
                <td className="py-4 pr-4">
                  <select aria-label={`Round for ${c.shortName}`} className="field !py-2" value={e.round ?? ""} onChange={(ev) => update(e.slug, { round: ev.target.value || undefined })}>
                    <option value="">Not decided</option>
                    {c.rounds.map((r) => (
                      <option key={r} value={r}>{roundLabel[r] ?? r}</option>
                    ))}
                  </select>
                </td>
                <td className="py-4 text-center">
                  <input type="checkbox" aria-label="Essays done" className="size-5 accent-[var(--ink)]" checked={!!e.essayDone} onChange={(ev) => update(e.slug, { essayDone: ev.target.checked })} />
                </td>
                <td className="py-4 text-center">
                  <input type="checkbox" aria-label="Aid forms done" className="size-5 accent-[var(--ink)]" checked={!!e.aidDocsDone} onChange={(ev) => update(e.slug, { aidDocsDone: ev.target.checked })} />
                </td>
                <td className="py-4 pr-4 text-sm">{c.intlAidPolicy ? aidLabel[c.intlAidPolicy] : "Check college site"}</td>
                <td className="py-4 text-right">
                  <button className="text-sm text-muted underline underline-offset-4 hover:text-signal" onClick={() => setList((l) => l.filter((x) => x.slug !== e.slug))}>
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-6 text-sm text-muted">Binding Early Decision means you must attend if admitted with an aid offer your family can accept. Choose it carefully.</p>
    </div>
  );
}
