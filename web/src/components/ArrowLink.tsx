import Link from "next/link";
import { ArrowRight } from "./icons";

// The circled-arrow link from the reference design.
export function ArrowLink({
  href,
  children,
  tone = "dark",
  external,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
  external?: boolean;
}) {
  const circle = tone === "dark" ? "bg-ink text-paper" : "bg-paper text-ink";
  const text = tone === "dark" ? "text-ink" : "text-paper";
  const inner = (
    <>
      <span
        className={`${circle} grid place-items-center size-12 shrink-0 rounded-full transition-transform group-hover:translate-x-1`}
      >
        <ArrowRight className="size-5" />
      </span>
      <span className={`${text} font-semibold text-[1.05rem] leading-snug`}>{children}</span>
    </>
  );
  const cls = "group inline-flex items-center gap-4";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
