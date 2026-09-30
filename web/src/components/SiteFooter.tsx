import Link from "next/link";
import { Logo } from "./Logo";
import { primaryNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="px-4 sm:px-12 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-6 max-w-md text-white/70">
            {site.tagline} Built by students, for students. No fees, no agency commissions, ever.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-2">
            {primaryNav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:underline underline-offset-4">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-white/60 leading-relaxed">
          College facts here are researched from official sources but policies change every year. Always confirm on the
          college&apos;s own website before you apply. {site.name} is not affiliated with any university.
        </p>
      </div>
    </footer>
  );
}
