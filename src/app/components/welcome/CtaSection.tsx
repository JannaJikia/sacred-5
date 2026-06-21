import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/app/components/Logo";

export function CtaSection() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28" style={{ borderTop: "1px solid var(--mkt-border)" }}>
      <div
        className="reveal relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] px-8 py-14 text-center sm:px-14"
        style={{
          border: "1px solid color-mix(in oklab, var(--mkt-accent) 28%, transparent)",
          background: "color-mix(in oklab, var(--mkt-accent) 9%, var(--mkt-surface))",
        }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-56 w-[420px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "color-mix(in oklab, var(--mkt-accent) 18%, transparent)" }}
          aria-hidden
        />
        <div className="relative flex flex-col items-center">
          <LogoMark size={44} />
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--mkt-text)" }}>
            Your next perfect day starts now
          </h2>
          <p className="mt-3 max-w-md text-lg" style={{ color: "var(--mkt-muted)" }}>
            Pick your practices, log the first one, and let the streak build itself.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold transition hover:brightness-105 active:scale-[0.98]"
            style={{ background: "var(--mkt-accent)", color: "var(--mkt-accent-ink)" }}
          >
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm" style={{ color: "var(--mkt-faint)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-medium underline underline-offset-4" style={{ color: "var(--mkt-text)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
