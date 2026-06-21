import Link from "next/link";
import { LogoMark } from "@/app/components/Logo";

export function WelcomeNav() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{ borderColor: "var(--mkt-border)", background: "color-mix(in oklab, var(--mkt-bg) 78%, transparent)" }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/welcome" className="flex items-center gap-2.5">
          <LogoMark size={30} />
          <span className="font-display text-lg font-semibold tracking-tight" style={{ color: "var(--mkt-text)" }}>
            Sacred 5
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-[var(--mkt-text)]"
            style={{ color: "var(--mkt-muted)" }}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full px-4 py-2 text-sm font-semibold transition hover:brightness-105 active:scale-[0.98]"
            style={{ background: "var(--mkt-accent)", color: "var(--mkt-accent-ink)" }}
          >
            Start free
          </Link>
        </div>
      </nav>
    </header>
  );
}
