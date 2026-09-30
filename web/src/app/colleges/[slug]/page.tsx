import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink } from "@/components/ArrowLink";
import { AddToList } from "@/components/colleges/AddToList";
import { ChanceCard } from "@/components/colleges/BandBadge";
import { Container, Notice } from "@/components/Page";
import { ExternalIcon } from "@/components/icons";
import { aidLabel, colleges, formatRate, formatUSD, getCollege, roundLabel } from "@/data/colleges";

export function generateStaticParams() {
  return colleges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/colleges/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = getCollege(slug);
  return { title: c?.name ?? "College" };
}

const testLabel = { required: "Required", optional: "Optional", flexible: "Flexible", blind: "Not considered" } as const;

export default async function CollegePage(props: PageProps<"/colleges/[slug]">) {
  const { slug } = await props.params;
  const c = getCollege(slug);
  if (!c) notFound();

  const facts: [string, string][] = [
    ["Admit rate", `${formatRate(c.acceptanceRate)}${c.acceptanceRateYear ? ` (${c.acceptanceRateYear})` : ""}`],
    ["SAT middle 50%", c.sat25 && c.sat75 ? `${c.sat25}–${c.sat75}` : "—"],
    ["SAT / ACT", c.testPolicy ? testLabel[c.testPolicy] : "—"],
    ["Cost per year (before aid)", `${formatUSD(c.costOfAttendanceUSD)}${c.costYear ? ` (${c.costYear})` : ""}`],
  ];

  return (
    <>
      <section className="hero-backdrop text-paper relative">
        <div className="absolute inset-0 grain" aria-hidden />
        <Container className="relative py-14 sm:py-20">
          <Link href="/colleges" className="text-white/70 hover:text-paper text-sm">← All colleges</Link>
          <h1 className="mt-6 text-5xl sm:text-7xl lg:text-8xl max-w-5xl">{c.name}</h1>
          <p className="mt-4 text-xl text-white/80">
            {c.city}, {c.state}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <div className="bg-paper">
              <AddToList slug={c.slug} />
            </div>
            <ArrowLink href={c.website} tone="light" external>
              Official website
            </ArrowLink>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <dl className="grid grid-cols-2 lg:grid-cols-4 border-t-4 border-ink">
          {facts.map(([k, v]) => (
            <div key={k} className="py-6 pr-4 border-b border-line">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="font-serif text-2xl sm:text-3xl mt-1">{v}</dd>
            </div>
          ))}
        </dl>
        {c.costBasis && <p className="mt-3 text-sm text-muted">Cost: {c.costBasis}</p>}
        {c.rounds.length > 0 && (
          <p className="mt-6 text-ink/80">
            <span className="font-semibold">Application rounds:</span> {c.rounds.map((r) => roundLabel[r] ?? r).join(" · ")}
          </p>
        )}
      </Container>

      <Container className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="text-4xl sm:text-5xl">Financial aid for international students</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {c.intlAidPolicy && (
              <span className={`px-3 py-1.5 font-semibold ${c.intlAidPolicy === "need-blind" ? "bg-accent-soft text-accent" : "bg-stone"}`}>
                {aidLabel[c.intlAidPolicy]}
              </span>
            )}
            {c.meetsFullNeedIntl === true && <span className="px-3 py-1.5 bg-stone font-semibold">Meets full demonstrated need</span>}
            {c.meetsFullNeedIntl === false && <span className="px-3 py-1.5 bg-warn-soft text-warn font-semibold">Does not promise full need</span>}
          </div>
          {c.notes && <p className="mt-6 text-lg leading-relaxed">{c.notes}</p>}
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {c.intlAidUrl && <ExtLink href={c.intlAidUrl}>International aid page</ExtLink>}
            {c.admissionsUrl && <ExtLink href={c.admissionsUrl}>Undergraduate admissions</ExtLink>}
          </div>
          <p className="mt-6 text-ink/70 text-[0.95rem] leading-relaxed">
            <strong>Need-blind</strong> means your ability to pay is not considered when deciding to admit you.{" "}
            <strong>Need-aware</strong> means it can be, so asking for aid can make admission harder.{" "}
            <strong>Meets full need</strong> means that if you are admitted, the college covers the gap between its cost and what
            it calculates your family can pay.
          </p>
        </section>
        <aside>
          <ChanceCard college={c} />
        </aside>
      </Container>

      {c.programs.length > 0 && (
        <Container className="pt-16">
          <h2 className="text-4xl sm:text-5xl">Programs & opportunities</h2>
          <hr className="mt-8 border-t-4 border-ink" />
          <ul className="grid md:grid-cols-2 gap-x-12">
            {c.programs.map((p) => (
              <li key={p.name} className="py-8 border-b border-line">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{p.kind.replace("-", " ")}</p>
                <h3 className="mt-2 text-3xl">{p.name}</h3>
                <p className="mt-3 text-ink/80 leading-relaxed">{p.description}</p>
                <div className="mt-4">
                  <ExtLink href={p.url}>Learn more</ExtLink>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      )}

      {c.schools.length > 0 && (
        <Container className="pt-16">
          <h2 className="text-4xl sm:text-5xl">Undergraduate schools</h2>
          <hr className="mt-8 border-t-4 border-ink" />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
            {c.schools.map((s) => (
              <li key={s.name} className="border-b border-line py-5 pr-4">
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-4">
                    <span className="font-serif text-2xl group-hover:underline underline-offset-4">{s.name}</span>
                    <ExternalIcon className="size-4 mt-2 shrink-0 text-muted" />
                  </a>
                ) : (
                  <span className="font-serif text-2xl">{s.name}</span>
                )}
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Container className="pt-16">
        <Notice tone={c.confidence === "high" ? "info" : "warn"}>
          Researched from official sources in September 2026
          {c.confidence !== "high" && ", but some details could not be fully confirmed"}. Policies change every year:
          confirm on the college&apos;s website before you apply.
          {c.sources.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">Sources</summary>
              <ul className="mt-2 space-y-1 break-all">
                {c.sources.map((s) => (
                  <li key={s}>
                    <a href={s} target="_blank" rel="noreferrer" className="underline">{s}</a>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </Notice>
      </Container>
    </>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold underline underline-offset-4 hover:decoration-2">
      {children}
      <ExternalIcon className="size-4" />
    </a>
  );
}
