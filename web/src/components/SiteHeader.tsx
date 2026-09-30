"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { announcement, primaryNav, quickLinks } from "@/lib/site";
import { profileStore, useProfile } from "@/lib/store";
import { colleges } from "@/data/colleges";
import { opportunities } from "@/data/opportunities";

type Panel = "menu" | "search" | null;

export function SiteHeader() {
  const pathname = usePathname();
  const [panel, setPanel] = useState<Panel>(null);
  const isHome = pathname === "/";
  const showTabs = !isHome && !pathname.startsWith("/login") && !pathname.startsWith("/signup");

  // Close overlays on navigation and on Escape; stop the page scrolling behind them.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setPanel(null);
  }
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [panel]);

  return (
    <>
      <header
        className={
          isHome
            ? "absolute inset-x-0 top-0 z-30 text-paper"
            : "sticky top-0 z-30 bg-paper text-ink border-b border-line"
        }
      >
        <div className="flex items-stretch justify-between">
          <div className="flex items-center gap-10 px-4 sm:px-8 py-3 min-w-0">
            <Logo tone={isHome ? "light" : "dark"} />
            <Link
              href={announcement.href}
              className="hidden xl:flex items-center gap-3 text-[1.05rem] hover:underline underline-offset-4 truncate"
            >
              <span className="size-2 shrink-0 rounded-full bg-signal" />
              {announcement.text}
            </Link>
          </div>
          <div className="flex shrink-0">
            <button
              onClick={() => setPanel("search")}
              className="flex items-center gap-3 bg-ink text-paper px-4 sm:px-10 border-r border-white/15 hover:bg-black"
              aria-label="Search"
            >
              <SearchIcon className="size-6" />
              <span className="hidden sm:inline text-lg">Search</span>
            </button>
            <button
              onClick={() => setPanel("menu")}
              className="flex items-center gap-3 bg-ink text-paper px-4 sm:px-10 hover:bg-black"
              aria-label="Menu"
            >
              <MenuIcon className="size-7" />
              <span className="hidden sm:inline text-lg">Menu</span>
            </button>
          </div>
        </div>
        {showTabs && <AppTabs pathname={pathname} />}
      </header>

      {panel === "menu" && <MenuOverlay onClose={() => setPanel(null)} />}
      {panel === "search" && <SearchOverlay onClose={() => setPanel(null)} />}
    </>
  );
}

function AppTabs({ pathname }: { pathname: string }) {
  return (
    <nav className="border-t border-line overflow-x-auto" aria-label="Sections">
      <ul className="flex gap-1 px-2 sm:px-6 min-w-max">
        {primaryNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-3 text-[0.95rem] border-b-2 ${
                  active ? "border-ink font-semibold" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function OverlayShell({ onClose, children, label }: { onClose: () => void; children: React.ReactNode; label: string }) {
  return (
    <div role="dialog" aria-modal aria-label={label} className="fixed inset-0 z-50 bg-[#0f0f0f] text-paper overflow-y-auto">
      <div className="flex items-center justify-between px-4 sm:px-12 py-5">
        <Logo tone="light" />
        <button onClick={onClose} className="flex items-center gap-4 text-lg" autoFocus>
          <span className="hidden sm:inline">Close</span>
          <span className="grid place-items-center size-12 rounded-full border border-white/40 hover:bg-white/10">
            <CloseIcon className="size-5" />
          </span>
        </button>
      </div>
      {children}
    </div>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const [profile] = useProfile();
  const router = useRouter();
  return (
    <OverlayShell onClose={onClose} label="Menu">
      <div className="flex flex-col min-h-[calc(100dvh-96px)]">
        <nav className="flex-1 px-4 sm:px-12 pt-6 sm:pt-12">
          <ul className="space-y-2 sm:space-y-4">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-serif text-5xl sm:text-7xl leading-[1.1] hover:underline decoration-1 underline-offset-8"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-white/70 text-lg">
            {profile ? (
              <p>
                Signed in on this device as <span className="text-paper font-semibold">{profile.name}</span>.{" "}
                <button
                  className="underline underline-offset-4 hover:text-paper"
                  onClick={() => {
                    profileStore.set(null);
                    router.push("/");
                  }}
                >
                  Log out
                </button>
              </p>
            ) : (
              <p>
                <Link href="/signup" className="underline underline-offset-4 text-paper">
                  Create your free profile
                </Link>{" "}
                or{" "}
                <Link href="/login" className="underline underline-offset-4 text-paper">
                  log in
                </Link>
                .
              </p>
            )}
          </div>
        </nav>
        <div className="border-t border-white/15 mt-12 px-4 sm:px-12 py-6 flex flex-wrap items-center gap-x-10 gap-y-3">
          <span className="text-white/50 text-lg">Quick links ›</span>
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href} className="font-semibold text-lg hover:underline underline-offset-4">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </OverlayShell>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const term = q.trim().toLowerCase();
  const collegeHits = term
    ? colleges.filter((c) => `${c.name} ${c.shortName} ${c.city} ${c.state}`.toLowerCase().includes(term)).slice(0, 6)
    : [];
  const oppHits = term
    ? opportunities
        .filter((o) => `${o.name} ${o.org} ${o.description} ${o.tags.join(" ")}`.toLowerCase().includes(term))
        .slice(0, 6)
    : [];

  return (
    <OverlayShell onClose={onClose} label="Search">
      <form
        className="px-4 sm:px-12 pt-8"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/colleges?q=${encodeURIComponent(q)}`);
        }}
      >
        <label htmlFor="site-search" className="block text-white/60 mb-3">
          Search colleges, programs and opportunities
        </label>
        <input
          id="site-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="Try “Penn”, “research”, “need-blind”"
          className="w-full bg-transparent border-b-2 border-white/40 focus:border-paper outline-none font-serif text-4xl sm:text-6xl py-3 placeholder:text-white/25"
        />
      </form>
      <div className="px-4 sm:px-12 py-10 grid gap-10 md:grid-cols-2">
        {collegeHits.length > 0 && (
          <section>
            <h2 className="text-sm uppercase tracking-widest text-white/50 mb-4">Colleges</h2>
            <ul className="space-y-3">
              {collegeHits.map((c) => (
                <li key={c.slug}>
                  <Link href={`/colleges/${c.slug}`} className="font-serif text-2xl hover:underline underline-offset-4">
                    {c.name}
                  </Link>
                  <span className="text-white/50 ml-2">
                    {c.city}, {c.state}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {oppHits.length > 0 && (
          <section>
            <h2 className="text-sm uppercase tracking-widest text-white/50 mb-4">Opportunities</h2>
            <ul className="space-y-3">
              {oppHits.map((o) => (
                <li key={o.id}>
                  <Link href={`/opportunities#${o.id}`} className="font-serif text-2xl hover:underline underline-offset-4">
                    {o.name}
                  </Link>
                  <span className="text-white/50 ml-2">{o.org}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {term && collegeHits.length + oppHits.length === 0 && (
          <p className="text-white/60 text-lg">Nothing found for “{q}”.</p>
        )}
      </div>
    </OverlayShell>
  );
}
