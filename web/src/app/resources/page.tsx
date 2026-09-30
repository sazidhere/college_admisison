import type { Metadata } from "next";
import { Container, PageIntro } from "@/components/Page";
import { ExternalIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Resources" };

type Res = { name: string; url: string; body: string };

const groups: { id: string; title: string; intro: string; items: Res[] }[] = [
  {
    id: "tests",
    title: "SAT & English tests",
    intro: "Start with official, free practice. Paid coaching is optional; plenty of students score well with these alone.",
    items: [
      { name: "Bluebook (College Board)", url: "https://bluebook.collegeboard.org/", body: "The official app for the digital SAT, with full-length practice tests scored like the real exam." },
      { name: "Official Digital SAT Prep on Khan Academy", url: "https://www.khanacademy.org/digital-sat", body: "Free lessons and practice built with College Board. Pair it with Bluebook practice tests." },
      { name: "SAT registration & test centres", url: "https://satsuite.collegeboard.org/sat/registration", body: "Register and find test centres in Bangladesh. Book early: seats in Dhaka fill up." },
      { name: "Duolingo English Test", url: "https://englishtest.duolingo.com/", body: "Taken online at home, results in about two days. Free practice tests on the site. Check each college accepts it." },
      { name: "IELTS", url: "https://ielts.org/", body: "Widely accepted. Many colleges ask for 7.0 overall or higher; some want more." },
      { name: "TOEFL iBT", url: "https://www.ets.org/toefl.html", body: "Accepted almost everywhere in the US. ETS offers free practice materials." },
    ],
  },
  {
    id: "apply",
    title: "Applications & aid forms",
    intro: "Most colleges use the Common App. Aid for internationals usually needs the CSS Profile or the college's own form.",
    items: [
      { name: "Common App", url: "https://www.commonapp.org/", body: "One application for 1,000+ colleges. Opens each year around August 1." },
      { name: "CSS Profile", url: "https://cssprofile.collegeboard.org/", body: "The financial-aid form many private colleges require from international applicants." },
      { name: "EducationUSA", url: "https://educationusa.state.gov/", body: "The US State Department's free, official advising network, with advisers serving Bangladesh." },
    ],
  },
  {
    id: "visa",
    title: "Student visa (F-1)",
    intro: "After you accept an offer, the college sends your I-20. Then: pay the SEVIS fee, fill in the DS-160, and book your interview at the US Embassy in Dhaka.",
    items: [
      { name: "Student visas (US State Department)", url: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html", body: "The official overview of the F-1 process and documents." },
      { name: "US Embassy Dhaka", url: "https://bd.usembassy.gov/", body: "Visa appointment information, wait times and embassy announcements." },
      { name: "SEVIS I-901 fee", url: "https://www.fmjfee.com/", body: "Pay the SEVIS fee here before your visa interview, and keep the receipt." },
      { name: "DS-160 online application", url: "https://ceac.state.gov/genniv/", body: "The visa application form. Save your application ID often." },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageIntro kicker="Resources" title="Official, free, and trustworthy" lead="Every link goes to the official source. If a website or agent asks you to pay for something listed here as free, be careful." />
      <Container className="py-8">
        {groups.map((g) => (
          <section key={g.id} id={g.id} className="grid gap-6 lg:grid-cols-[1fr_2fr] py-12 border-b border-line scroll-mt-36">
            <div>
              <h2 className="text-4xl sm:text-5xl">{g.title}</h2>
              <p className="mt-4 text-ink/75 leading-relaxed">{g.intro}</p>
            </div>
            <ul className="border-t-4 border-ink">
              {g.items.map((r) => (
                <li key={r.url} className="py-5 border-b border-line">
                  <a href={r.url} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-2">
                    <span className="font-serif text-2xl group-hover:underline underline-offset-4">{r.name}</span>
                    <ExternalIcon className="size-4 mt-2 text-muted" />
                  </a>
                  <p className="mt-1 text-ink/75">{r.body}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
