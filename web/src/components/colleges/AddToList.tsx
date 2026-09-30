"use client";

import { CheckIcon, PlusIcon } from "@/components/icons";
import { useHydrated, useList } from "@/lib/store";

export function AddToList({ slug, compact }: { slug: string; compact?: boolean }) {
  const [list, setList] = useList();
  const hydrated = useHydrated();
  const inList = hydrated && list.some((e) => e.slug === slug);
  const toggle = () =>
    setList((l) =>
      l.some((e) => e.slug === slug)
        ? l.filter((e) => e.slug !== slug)
        : [...l, { slug, status: "researching", addedAt: new Date().toISOString() }],
    );
  return (
    <button
      onClick={toggle}
      aria-pressed={inList}
      className={`inline-flex items-center gap-2 border font-semibold transition-colors ${compact ? "px-3 py-2 text-sm" : "px-5 py-3"} ${
        inList ? "bg-ink text-paper border-ink" : "border-ink hover:bg-ink hover:text-paper"
      }`}
    >
      {inList ? <CheckIcon className="size-4" /> : <PlusIcon className="size-4" />}
      {inList ? "On my list" : "Add to list"}
    </button>
  );
}
