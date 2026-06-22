import Link from "next/link";
import { LogoWordmark } from "@/app/components/Logo";

export function WelcomeFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-5 py-10 sm:px-8" style={{ borderTop: "1px solid var(--mkt-border)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center" style={{ color: "var(--mkt-text)" }}>
            <LogoWordmark size={24} />
          </div>
          <p className="text-sm" style={{ color: "var(--mkt-faint)" }}>
            A quieter way to keep a daily practice.
          </p>
          <Link
            href="/register"
            className="text-sm transition-colors hover:text-[var(--mkt-text)]"
            style={{ color: "var(--mkt-muted)" }}
          >
            Start free
          </Link>
        </div>

        <p
          className="mt-8 border-t pt-6 text-center text-xs"
          style={{ borderColor: "var(--mkt-border)", color: "var(--mkt-faint)" }}
        >
          © {year} Sacred 5. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
