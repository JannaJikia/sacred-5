import Link from "next/link";
import { LogoMark } from "@/app/components/Logo";

export function WelcomeFooter() {
  return (
    <footer className="px-5 py-10 sm:px-8" style={{ borderTop: "1px solid var(--mkt-border)" }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <LogoMark size={26} />
          <span className="font-serif text-lg font-semibold" style={{ color: "var(--mkt-text)" }}>
            Sacred 5
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm" style={{ color: "var(--mkt-muted)" }}>
          <Link href="/login" className="transition-colors hover:text-[var(--mkt-text)]">
            Sign in
          </Link>
          <Link href="/register" className="transition-colors hover:text-[var(--mkt-text)]">
            Start free
          </Link>
        </nav>
        <p className="text-sm" style={{ color: "var(--mkt-faint)" }}>
          A quieter way to keep a daily practice.
        </p>
      </div>
    </footer>
  );
}
