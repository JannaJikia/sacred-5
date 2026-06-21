import { features, sampleWeek } from "@/app/components/welcome/constants";

const [streaks, progress, privacy] = features;

function WeeklyBars() {
  const total = sampleWeek.reduce((sum, d) => sum + d.sessions, 0);
  return (
    <div className="mt-7 rounded-2xl p-5" style={{ background: "var(--mkt-bg)", border: "1px solid var(--mkt-border)" }}>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--mkt-faint)" }}>
          This week
        </span>
        <span className="font-display text-sm font-semibold" style={{ color: "var(--mkt-text)" }}>
          {total} sessions
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {sampleWeek.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-xs" style={{ color: "var(--mkt-muted)" }}>
              {d.label}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "var(--mkt-surface-2)" }}>
              <span
                className="block h-full rounded-full"
                style={{ width: `${Math.round(d.fill * 100)}%`, background: "var(--mkt-accent)" }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28" style={{ borderTop: "1px solid var(--mkt-border)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--mkt-text)" }}>
            Why it sticks
          </h2>
          <p className="mt-3 text-lg" style={{ color: "var(--mkt-muted)" }}>
            Simple enough to do daily. Honest enough to mean something.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {/* Large feature with a real data visual */}
          <article
            className="reveal flex flex-col rounded-3xl p-7 lg:row-span-2"
            style={{ border: "1px solid var(--mkt-border)", background: "var(--mkt-surface)" }}
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: "color-mix(in oklab, var(--mkt-accent) 16%, transparent)", color: "var(--mkt-accent)" }}
            >
              <progress.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold" style={{ color: "var(--mkt-text)" }}>
              {progress.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--mkt-muted)" }}>
              {progress.description}
            </p>
            <WeeklyBars />
          </article>

          {[streaks, privacy].map((f) => (
            <article
              key={f.title}
              className="reveal flex flex-col rounded-3xl p-7"
              style={{
                border: "1px solid var(--mkt-border)",
                background: "var(--mkt-surface)",
              }}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: "color-mix(in oklab, var(--mkt-accent) 16%, transparent)", color: "var(--mkt-accent)" }}
              >
                <f.icon className="h-[22px] w-[22px]" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold" style={{ color: "var(--mkt-text)" }}>
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--mkt-muted)" }}>
                {f.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
