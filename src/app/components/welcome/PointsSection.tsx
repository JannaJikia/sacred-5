import { PRACTICES } from "@/config/practices";

const PERFECT_DAY = PRACTICES.reduce((sum, p) => sum + p.points * p.maxPerDay, 0);

const CAPS = PRACTICES.map((p) => ({
  label: p.label,
  cap: p.maxPerDay === 1 ? "once" : `${p.maxPerDay}×`,
}));

export function PointsSection() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28" style={{ borderTop: "1px solid var(--mkt-border)" }}>
      <div className="mx-auto max-w-6xl">
        <div
          className="reveal grid items-center gap-10 rounded-3xl p-8 sm:p-12 lg:grid-cols-12"
          style={{ border: "1px solid var(--mkt-border)", background: "var(--mkt-surface)" }}
        >
          <div className="lg:col-span-4">
            <div className="font-display text-7xl font-bold leading-none" style={{ color: "var(--mkt-accent)" }}>
              {PERFECT_DAY}
            </div>
            <div className="mt-3 text-base font-medium" style={{ color: "var(--mkt-muted)" }}>
              points is a perfect day
            </div>
          </div>

          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl font-bold tracking-tight" style={{ color: "var(--mkt-text)" }}>
              Points that keep you honest
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed" style={{ color: "var(--mkt-muted)" }}>
              Every practice has a daily cap, so you cannot grind the same one for an easy score. Hit each at its limit
              and the day tops out at {PERFECT_DAY}. No vanity streaks, just the work.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {CAPS.map((c) => (
                <span
                  key={c.label}
                  className="rounded-full px-3 py-1.5 text-sm"
                  style={{ background: "var(--mkt-surface-2)", color: "var(--mkt-muted)" }}
                >
                  {c.label} <span style={{ color: "var(--mkt-faint)" }}>{c.cap}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
