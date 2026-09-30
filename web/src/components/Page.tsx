export function PageIntro({ kicker, title, lead, children }: { kicker?: string; title: string; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="bg-mist">
      <div className="px-4 sm:px-12 pt-14 pb-12 max-w-[1500px] mx-auto">
        {kicker && <p className="uppercase tracking-[0.2em] text-sm text-muted">{kicker}</p>}
        <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <h1 className="text-5xl sm:text-7xl max-w-4xl">{title}</h1>
          {children}
        </div>
        {lead && <div className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/80">{lead}</div>}
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 sm:px-12 max-w-[1500px] mx-auto ${className}`}>{children}</div>;
}

export function Button({
  children,
  variant = "solid",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "outline" | "ghost" }) {
  const styles = {
    solid: "bg-ink text-paper hover:bg-black disabled:bg-muted",
    outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
    ghost: "text-ink hover:bg-stone",
  }[variant];
  return (
    <button className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors disabled:cursor-not-allowed ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const cls = tone === "warn" ? "bg-warn-soft text-warn border-warn/30" : "bg-accent-soft text-accent border-accent/20";
  return <div className={`border px-4 py-3 text-[0.95rem] leading-relaxed ${cls}`}>{children}</div>;
}
