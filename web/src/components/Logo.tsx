import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-ink" : "text-paper";
  return (
    <Link href="/" className={`flex items-center gap-3 ${text}`} aria-label={`${site.name} home`}>
      <span className="relative grid place-items-center size-11 bg-accent text-paper font-serif text-2xl leading-none">
        U<span className="absolute right-1 top-1 size-1.5 rounded-full bg-signal" />
      </span>
      <span className="leading-none">
        <span className="block font-serif text-[1.6rem] tracking-[0.08em] uppercase">{site.name}</span>
        <span className="block text-[0.72rem] tracking-[0.2em] uppercase opacity-80 mt-1">
          {site.bangla} · US admissions
        </span>
      </span>
    </Link>
  );
}
