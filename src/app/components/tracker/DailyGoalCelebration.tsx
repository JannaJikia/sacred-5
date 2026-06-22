"use client";

import { CELEBRATION_STRINGS } from "@/config/strings/tracker";
import { cn } from "@/lib/utils";
import { Coins, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  coinsEarned: number;
  totalCoins: number;
  dailyGoal: number;
  onDismiss: () => void;
};

export function DailyGoalCelebration({ open, coinsEarned, totalCoins, dailyGoal, onDismiss }: Props) {
  const dismissRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevActive = document.activeElement;
    dismissRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      if (prevActive instanceof HTMLElement && document.body.contains(prevActive)) {
        prevActive.focus();
      }
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
      onClick={onDismiss}
    >
      <div
        className={cn(
          "relative w-full max-w-sm overflow-hidden rounded-3xl border border-primary/25 bg-card p-8 text-center shadow-2xl",
          "motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft brand wash, contained and static */}
        <div
          className="pointer-events-none absolute -top-16 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30 text-primary">
            <Sparkles className="h-8 w-8" aria-hidden />
          </div>

          <h2 id="celebration-title" className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground">
            {CELEBRATION_STRINGS.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{CELEBRATION_STRINGS.subtitle(dailyGoal)}</p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/12 px-4 py-2 text-base font-bold text-primary tabular-nums">
            <Coins className="h-4 w-4" aria-hidden />
            {CELEBRATION_STRINGS.coinsLine(coinsEarned)}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{CELEBRATION_STRINGS.balanceLine(totalCoins)}</p>

          <button
            ref={dismissRef}
            type="button"
            className="mt-7 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[0.98]"
            onClick={onDismiss}
          >
            {CELEBRATION_STRINGS.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
