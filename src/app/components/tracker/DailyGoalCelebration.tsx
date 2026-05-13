"use client";

import { CELEBRATION_STRINGS } from "@/config/strings/tracker";
import { cn } from "@/lib/utils";
import { Coins, Sparkles, Star } from "lucide-react";
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      <div
        className={cn(
          "relative max-w-sm overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 text-center shadow-2xl",
          "animate-in zoom-in-95 duration-300"
        )}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden text-primary/35">
          <Sparkles className="absolute left-[10%] top-6 h-7 w-7 animate-bounce" aria-hidden />
          <Star className="absolute right-[12%] top-10 h-6 w-6 animate-bounce [animation-delay:120ms]" aria-hidden />
          <Coins
            className="absolute left-[20%] bottom-16 h-6 w-6 animate-bounce text-amber-600/50 [animation-delay:200ms] dark:text-amber-400/45"
            aria-hidden
          />
          <Sparkles className="absolute right-[18%] bottom-12 h-7 w-7 animate-bounce [animation-delay:280ms]" aria-hidden />
        </div>

        <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
          <Sparkles className="h-8 w-8 text-white" aria-hidden />
        </div>

        <h2 id="celebration-title" className="text-xl font-bold tracking-tight text-foreground">
          {CELEBRATION_STRINGS.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{CELEBRATION_STRINGS.subtitle(dailyGoal)}</p>

        <div className="mt-6 flex flex-col items-center gap-1">
          <div className="rounded-full bg-primary/15 px-4 py-2 text-lg font-bold text-primary tabular-nums">
            {CELEBRATION_STRINGS.coinsLine(coinsEarned)}
          </div>
          <p className="text-xs text-muted-foreground">{CELEBRATION_STRINGS.balanceLine(totalCoins)}</p>
        </div>

        <button
          ref={dismissRef}
          type="button"
          className="mt-8 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 active:scale-[0.98]"
          onClick={onDismiss}
        >
          {CELEBRATION_STRINGS.dismiss}
        </button>
      </div>
    </div>
  );
}
