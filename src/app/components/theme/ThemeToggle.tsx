"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { THEME_STRINGS } from "@/config/strings/theme";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label={THEME_STRINGS.toggleAria}
      title={theme === "dark" ? THEME_STRINGS.light : THEME_STRINGS.dark}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition hover:bg-muted",
        className
      )}
      onClick={() => setTheme(next)}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
