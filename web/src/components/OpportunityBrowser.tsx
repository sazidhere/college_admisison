"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "./Page";
import { ExternalIcon } from "./icons";
import { colleges } from "@/data/colleges";
import { categoryLabel, opportunities, type OpportunityCategory } from "@/data/opportunities";
import { useHydrated, useProfile } from "@/lib/store";

type Filter = "all" | "university" | OpportunityCategory;

const universityPrograms = colleges.flatMap((c) => c.programs.map((p) => ({ ...p, college: c })));

export function OpportunityBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [mine, setMine] = useState(false);
  const [profile] = useProfile();
  const hydrated = useHydrated();
  const classLevel = hydrated ? profile?.classLevel : undefined;

  const cats = (Object.keys(categoryLabel) as OpportunityCategory[]).filter((k) => opportunities.some((o) => o.category === k));
  const filters: [Filter, string][] = [["all", "All"], ["university", "University programs"], ...cats.map((k) => [k, categoryLabel[k]] as [Filter, string])];

  const opps = opportunities.filter(
    (o) => (filter === "all" || filter === o.category) && (!mine || !classLevel || o.classLevels.includes(classLevel)),
  );

  return (
    <Container className="py-8">
      <div className="flex flex-wrap gap-2">
        {filters.map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} aria-pressed={filter === v} className={`px-4 py-2 border ${filter === v ? "bg-ink text-paper border-ink" : "border-line hover:border-ink"}`}>
            {l}
          </button>
        ))}
        {classLevel && (
          <label className="flex items-center gap-2 px-4 py-2 ml-auto">
            <input type="checkbox" className="size-4 accent-[var(--ink)]" checked={mine} onChange={(e) => setMine(e.target.checked)} />
            Only for class {classLevel}
          </label>
        )}
      </div>

      {filter !== "university" && opps.length > 0 && (
        <ul className="mt-8 border-t-4 border-ink">
          {opps.map((o) => (
            <li id={o.id} key={o.id} className="grid gap-4 md:grid-cols-[2fr_1.2fr] py-8 border-b border-line scroll-mt-40">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  {categoryLabel[o.category]} · {o.org}
                </p>
                <h3 className="mt-2 text-3xl">
                  <a href={o.url} target="_blank" rel="noreferrer" className="hover:underline underline-offset-4 inline-flex items-start gap-2">
                    {o.name}
                    <ExternalIcon className="size-4 mt-2 shrink-0 text-muted" />
                  </a>
                </h3>
                <p className="mt-3 text-ink/80 leading-relaxed">{o.description}</p>
              </div>
              <dl className="text-[0.95rem] space-y-2 md:pt-6">
                <div><dt className="inline font-semibold">Who: </dt><dd className="inline text-ink/80">{o.eligibility}</dd></div>
                <div><dt className="inline font-semibold">Cost: </dt><dd className="inline text-ink/80">{o.cost}</dd></div>
                {o.deadlineHint && <div><dt className="inline font-semibold">When: </dt><dd className="inline text-ink/80">{o.deadlineHint}</dd></div>}
                {o.classLevels.length > 0 && (
                  <div><dt className="inline font-semibold">Good for: </dt><dd className="inline text-ink/80">Class {o.classLevels.join(", ")}</dd></div>
                )}
                {o.confidence !== "high" && <p className="text-warn text-sm">Check details on the official page; some could not be fully confirmed.</p>}
              </dl>
            </li>
          ))}
        </ul>
      )}

      {(filter === "all" || filter === "university") && universityPrograms.length > 0 && (
        <section className="mt-16">
          <h2 className="text-4xl sm:text-5xl">Special programs at universities</h2>
          <p className="mt-3 text-ink/75 max-w-3xl">Programs inside universities that you apply to, or join once you are there. Knowing them early helps you write sharper applications.</p>
          <ul className="mt-8 border-t-4 border-ink grid md:grid-cols-2 gap-x-12">
            {universityPrograms.map((p) => (
              <li key={`${p.college.slug}-${p.name}`} className="py-8 border-b border-line">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  <Link href={`/colleges/${p.college.slug}`} className="hover:underline">{p.college.shortName}</Link> · {p.kind.replace("-", " ")}
                </p>
                <h3 className="mt-2 text-3xl">
                  <a href={p.url} target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">{p.name}</a>
                </h3>
                <p className="mt-3 text-ink/80 leading-relaxed">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
