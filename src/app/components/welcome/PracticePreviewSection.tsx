import { practices } from "@/app/components/welcome/constants";

export function PracticePreviewSection() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28" style={{ borderTop: "1px solid var(--mkt-border)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--mkt-text)" }}>
            What you&apos;ll track
          </h2>
          <p className="mt-3 text-lg" style={{ color: "var(--mkt-muted)" }}>
            Four practices, chosen because they compound. Add your own once you are in.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {practices.map((p, i) => (
            <div
              key={p.key}
              className="reveal flex flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: "1px solid var(--mkt-border)",
                background:
                  i % 3 === 0 ? "color-mix(in oklab, var(--mkt-accent) 7%, var(--mkt-surface))" : "var(--mkt-surface)",
              }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "color-mix(in oklab, var(--mkt-accent) 16%, transparent)", color: "var(--mkt-accent)" }}
              >
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold" style={{ color: "var(--mkt-text)" }}>
                {p.label}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed" style={{ color: "var(--mkt-muted)" }}>
                {p.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    background: "color-mix(in oklab, var(--mkt-accent) 14%, transparent)",
                    color: "var(--mkt-accent)",
                  }}
                >
                  +{p.points} {p.points === 1 ? "point" : "points"}
                </span>
                <span className="text-xs" style={{ color: "var(--mkt-faint)" }}>
                  {p.cadence}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
