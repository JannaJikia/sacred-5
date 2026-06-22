import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { practices } from "@/app/components/welcome/constants";

/** Illustrative "today" state for the preview card. Not real user data. */
const DONE: Record<string, boolean> = {
  walk: true,
  cold_shower: true,
  journal: false,
  meditation: true,
};

function TodayPreview() {
  const earned = practices.filter((p) => DONE[p.key]).reduce((sum, p) => sum + p.points, 0);

  return (
    <div
      className="relative w-full max-w-md rounded-3xl p-6 shadow-2xl"
      style={{ background: "var(--mkt-surface-2)", border: "1px solid var(--mkt-border-strong)" }}
    >
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-xs font-medium" style={{ color: "var(--mkt-faint)" }}>
            Today
          </div>
          <div className="font-display text-lg font-semibold" style={{ color: "var(--mkt-text)" }}>
            Tuesday
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-bold" style={{ color: "var(--mkt-accent)" }}>
            {earned}
          </div>
          <div className="text-xs" style={{ color: "var(--mkt-faint)" }}>
            points
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {practices.map((p) => {
          const done = DONE[p.key];
          return (
            <div
              key={p.key}
              className="flex items-center gap-3 rounded-2xl px-3.5 py-3"
              style={{ background: done ? "color-mix(in oklab, var(--mkt-accent) 12%, transparent)" : "var(--mkt-surface)" }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "color-mix(in oklab, var(--mkt-accent) 16%, transparent)",
                  color: "var(--mkt-accent)",
                }}
              >
                <p.icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium" style={{ color: "var(--mkt-text)" }}>
                  {p.label}
                </div>
                <div className="text-xs" style={{ color: "var(--mkt-faint)" }}>
                  +{p.points} pts
                </div>
              </div>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={
                  done
                    ? { background: "var(--mkt-accent)", color: "var(--mkt-accent-ink)" }
                    : { border: "1.5px solid var(--mkt-border-strong)" }
                }
                aria-hidden
              >
                {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 lg:pb-28 lg:pt-24">
      {/* single soft brand wash, low and off to one side - not a centered blob stack */}
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-[460px] w-[560px] rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--mkt-accent) 14%, transparent)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 xl:col-span-7">
          <p className="text-sm font-medium uppercase tracking-[0.18em]" style={{ color: "var(--mkt-sage)" }}>
            Five daily practices
          </p>
          <h1
            className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: "var(--mkt-text)" }}
          >
            A few good habits, done <span style={{ color: "var(--mkt-accent)" }}>every day</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "var(--mkt-muted)" }}>
            Walk, cold shower, journal, meditation. Tap to log each one and keep your streak going. No feeds, no
            pressure, just the habits that matter.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition hover:brightness-105 active:scale-[0.98]"
              style={{ background: "var(--mkt-accent)", color: "var(--mkt-accent-ink)" }}
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border px-7 py-3.5 text-base font-semibold transition hover:bg-[var(--mkt-surface)]"
              style={{ borderColor: "var(--mkt-border-strong)", color: "var(--mkt-text)" }}
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-6 lg:justify-end xl:col-span-5">
          <TodayPreview />
        </div>
      </div>
    </section>
  );
}
