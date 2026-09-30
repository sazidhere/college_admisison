import Link from "next/link";
import { ArrowLink } from "@/components/ArrowLink";
import { colleges } from "@/data/colleges";
import { site } from "@/lib/site";

const features = [
  {
    kicker: "Roadmap",
    title: "Know exactly where you are, and what comes next",
    body: "Tell us your class and we lay out every step from class 7 to your visa interview, with dates. Anything you are behind on is flagged with a red dot.",
    href: "/dashboard",
    cta: "See the roadmap",
    art: "roadmap",
  },
  {
    kicker: "Colleges",
    title: "Build a college list that fits you, and your family's budget",
    body: "See each college's schools, special programs and its aid policy for international students. Every college is marked reach, target or likely based on your profile.",
    href: "/colleges",
    cta: "Explore colleges",
    art: "list",
  },
  {
    kicker: "Opportunities",
    title: "Find programs most students in Bangladesh never hear about",
    body: "Dual degrees like Penn's Huntsman Program, research programs, olympiads, summer schools with aid, and free advising in Bangladesh.",
    href: "/opportunities",
    cta: "Browse opportunities",
    art: "opps",
  },
  {
    kicker: "Profile & assistant",
    title: "Shape your story with an assistant that knows your profile",
    body: "Record your grades, tests, activities and awards once. Then ask the assistant how to strengthen them, or how to start an essay.",
    href: "/assistant",
    cta: "Talk to the assistant",
    art: "chat",
  },
] as const;

export default function Home() {
  const needBlind = colleges.filter((c) => c.intlAidPolicy === "need-blind");
  return (
    <>
      {/* Hero */}
      <section className="relative hero-backdrop text-paper min-h-[92dvh] flex items-center">
        <div className="absolute inset-0 grain opacity-60" aria-hidden />
        <div className="relative w-full px-4 sm:px-12 pt-32 pb-20 text-center">
          <p className="uppercase tracking-[0.25em] text-sm text-white/70">Free · For students in Bangladesh</p>
          <h1 className="mt-6 text-[2.9rem] sm:text-7xl lg:text-8xl max-w-5xl mx-auto">
            From Bangladesh to the world&apos;s best universities
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Many top US colleges cover the full cost for students they admit, including students from Bangladesh.{" "}
            {site.name} shows you how to get there, one step at a time.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center items-center">
            <ArrowLink href="/signup" tone="light">
              Create your free profile
            </ArrowLink>
            <ArrowLink href="/colleges" tone="light">
              Explore colleges
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* What you can do */}
      <section className="bg-mist">
        <div className="px-4 sm:px-12 pt-20 max-w-[1500px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2 className="text-5xl sm:text-6xl max-w-2xl">Everything for your application, in one place</h2>
            <div className="max-w-md">
              <ArrowLink href="/signup">Start with a 3-minute profile. No fee, now or ever.</ArrowLink>
            </div>
          </div>
          <hr className="mt-12 border-t-4 border-ink" />
        </div>
        <div className="px-4 sm:px-12 max-w-[1500px] mx-auto pb-24">
          {features.map((f, i) => (
            <article
              key={f.kicker}
              className={`grid gap-10 md:gap-16 md:grid-cols-2 items-center py-16 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <FeatureArt kind={f.art} />
              </div>
              <div>
                <p className="uppercase tracking-[0.2em] text-sm text-muted">{f.kicker}</p>
                <h3 className="mt-4 text-4xl sm:text-5xl">{f.title}</h3>
                <p className="mt-6 text-lg leading-relaxed text-ink/80">{f.body}</p>
                <div className="mt-8">
                  <ArrowLink href={f.href}>{f.cta}</ArrowLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Full aid statement, in the style of the dark feature card */}
      <section className="px-4 sm:px-12 py-10 max-w-[1500px] mx-auto">
        <div className="relative overflow-hidden bg-ink text-paper">
          <div className="absolute inset-0 hero-backdrop opacity-70" aria-hidden />
          <div className="absolute inset-0 grain" aria-hidden />
          <div className="relative p-8 sm:p-16 lg:p-20 max-w-3xl">
            <h2 className="text-6xl sm:text-7xl">Full aid is real</h2>
            <p className="mt-8 text-lg sm:text-xl leading-relaxed text-white/90">
              A small group of US colleges admit international students without looking at whether they can pay, then
              meet their full financial need
              {needBlind.length > 0 && (
                <>
                  , including{" "}
                  {needBlind.slice(0, 5).map((c, i, arr) => (
                    <span key={c.slug}>
                      <Link href={`/colleges/${c.slug}`} className="prose-link">
                        {c.shortName}
                      </Link>
                      {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " and " : ""}
                    </span>
                  ))}
                </>
              )}
              . Many others meet full need for the internationals they admit. For a family in Bangladesh, that can mean
              paying little or nothing.
            </p>
            <div className="mt-10">
              <ArrowLink href="/colleges?aid=need-blind" tone="light">
                See need-blind colleges
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section id="stories" className="px-4 sm:px-12 pt-20 max-w-[1500px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h2 className="text-5xl sm:text-6xl max-w-2xl">Stories from those who went before you</h2>
          <p className="max-w-md text-lg text-ink/80">
            Bangladeshi students at US universities, in their own words: what they did in school, what they wrote about,
            and what they wish they had known.
          </p>
        </div>
        <hr className="mt-12 border-t-4 border-ink" />
        <div className="grid gap-8 md:grid-cols-3 py-14">
          {["Ivy League", "Liberal arts college", "Engineering school"].map((k) => (
            <div key={k} className="bg-mist p-8 flex flex-col justify-between min-h-72">
              <p className="uppercase tracking-[0.2em] text-sm text-muted">{k}</p>
              <div>
                <p className="font-serif text-3xl">Story coming soon</p>
                <p className="mt-3 text-ink/70">
                  Are you a Bangladeshi student abroad? Share your journey and help the next student.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Younger students */}
      <section className="px-4 sm:px-12 py-16 max-w-[1500px] mx-auto">
        <div className="grid gap-10 md:grid-cols-2 items-center border-t border-line pt-16">
          <h2 className="text-5xl sm:text-6xl">In class 7, 8 or 9? You are early, and that is an advantage.</h2>
          <div>
            <p className="text-lg leading-relaxed text-ink/80">
              The students who get into top universities with full aid usually started building years before they
              applied. The roadmap shows what to focus on at each class, beyond SSC and HSC results.
            </p>
            <div className="mt-8">
              <ArrowLink href="/signup">Make a plan for your class</ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureArt({ kind }: { kind: (typeof features)[number]["art"] }) {
  // Simple typographic illustrations until real photos of students are added.
  const shell = "relative aspect-[16/10] overflow-hidden bg-ink text-paper p-6 sm:p-10 flex flex-col justify-end";
  if (kind === "roadmap")
    return (
      <div className={shell}>
        <div className="absolute inset-0 hero-backdrop opacity-80" aria-hidden />
        <ol className="relative space-y-3 font-serif text-2xl sm:text-3xl">
          {["Explore", "Build", "Prepare", "Apply", "Decide & go"].map((s, i) => (
            <li key={s} className={`flex items-center gap-4 ${i === 3 ? "" : "opacity-50"}`}>
              <span className={`size-3 rounded-full ${i === 3 ? "bg-signal" : "bg-paper"}`} />
              {s}
            </li>
          ))}
        </ol>
      </div>
    );
  if (kind === "list")
    return (
      <div className={`${shell} bg-paper text-ink border border-line`}>
        <ul className="relative divide-y divide-line text-base sm:text-lg">
          {[
            ["Princeton", "Reach"],
            ["Amherst", "Reach"],
            ["Your target school", "Target"],
            ["Your likely school", "Likely"],
          ].map(([n, b]) => (
            <li key={n} className="flex justify-between py-3">
              <span className="font-serif text-2xl">{n}</span>
              <span className="text-sm uppercase tracking-widest text-muted self-center">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  if (kind === "opps")
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-gradient-to-br from-accent to-[#0b2a22]" aria-hidden />
        <div className="absolute inset-0 grain" aria-hidden />
        <p className="relative font-serif text-4xl sm:text-5xl leading-tight">
          Huntsman. M&amp;T. UROP. Olympiads. Summer schools.
        </p>
      </div>
    );
  return (
    <div className={`${shell} bg-mist text-ink border border-line`}>
      <div className="relative space-y-3 text-base">
        <p className="bg-paper border border-line p-4 max-w-[85%]">How can I make my robotics club activity stronger?</p>
        <p className="bg-ink text-paper p-4 max-w-[85%] ml-auto">
          Start with what changed because of you: how many members, what you built, who you taught.
        </p>
      </div>
    </div>
  );
}
