"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { getStreak } from "@/lib/http/api";
import { cn } from "@/lib/utils";
import { TRACKER_STRINGS } from "@/config/strings/tracker";

export function StreakBadge() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const r = await getStreak();
        if (mounted) setStreak(r.streak);
      } catch {
        /* Non-critical: leave the badge hidden rather than show an error. */
      }
    };
    void load();
    const onUpdated = () => void load();
    window.addEventListener("practice-updated", onUpdated);
    return () => {
      mounted = false;
      window.removeEventListener("practice-updated", onUpdated);
    };
  }, []);

  if (streak === null) {
    return <div className="h-[68px] animate-pulse rounded-2xl border bg-card" />;
  }

  const active = streak > 0;

  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        <Flame className="h-5 w-5" />
      </span>
      <div>
        <div className="text-sm font-semibold text-foreground">
          {active ? TRACKER_STRINGS.streakTitle(streak) : TRACKER_STRINGS.streakEmptyTitle}
        </div>
        <div className="text-xs text-muted-foreground">
          {active ? TRACKER_STRINGS.streakHint : TRACKER_STRINGS.streakEmptyHint}
        </div>
      </div>
    </div>
  );
}
