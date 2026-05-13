"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Coins, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/app/components/auth/LogoutButton";
import { LogoWordmark } from "@/app/components/Logo";
import { ThemeToggle } from "@/app/components/theme/ThemeToggle";
import { APP_NAV_LINKS, NAV_STRINGS } from "@/config/strings/nav";
import { shellPageMeta } from "@/app/components/app-shell/meta";

export function AppShell({
  children,
  initialCoins,
}: {
  children: React.ReactNode;
  initialCoins: number;
}) {
  const pathname = usePathname();
  const { title, subtitle } = shellPageMeta(pathname);
  const [coins, setCoins] = useState(initialCoins);

  useEffect(() => {
    setCoins(initialCoins);
  }, [initialCoins]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ coins: number }>;
      if (typeof ce.detail?.coins === "number") setCoins(ce.detail.coins);
    };
    window.addEventListener("coins-updated", handler as EventListener);
    return () => window.removeEventListener("coins-updated", handler as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="hidden md:block">
            <div className="sticky top-6 space-y-2">
              <div className="mb-6 flex items-center justify-between gap-2 px-1">
                <LogoWordmark size={36} />
                <ThemeToggle />
              </div>

              <nav className="space-y-0.5">
                {APP_NAV_LINKS.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="my-3 border-t border-border" />

              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-sm">
                <span className="text-muted-foreground">{NAV_STRINGS.coins}</span>
                <span className="font-bold tabular-nums text-primary">{coins}</span>
              </div>

              <LogoutButton
                redirectTo="/welcome"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-50"
                icon={<LogOut className="h-4 w-4 shrink-0" />}
                label={NAV_STRINGS.logout}
              />
            </div>
          </aside>

          <main className="min-w-0 pb-24 md:pb-0">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <div
                  className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-primary"
                  aria-label={`${NAV_STRINGS.coins}: ${coins}`}
                >
                  <Coins className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                  <span className="tabular-nums">{coins}</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border bg-card/95 backdrop-blur-sm md:hidden">
        {APP_NAV_LINKS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", active && "scale-110 transition-transform")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <LogoutButton
            redirectTo="/welcome"
            className="flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground disabled:opacity-50"
            icon={<LogOut className="h-5 w-5" />}
            label={NAV_STRINGS.logout}
          />
        </div>
      </nav>
    </div>
  );
}
