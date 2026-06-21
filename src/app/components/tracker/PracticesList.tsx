"use client";

import { useState } from "react";
import { PracticeRow } from "./PracticeRow";
import { useTrackerData } from "./useTrackerData";
import { useTrackerActions } from "./useTrackerActions";
import { DailyGoalCelebration } from "./DailyGoalCelebration";
import { AlertCircle, RefreshCw } from "lucide-react";
import { TRACKER_STRINGS } from "@/config/strings/tracker";
import { DAILY_COMPLETION_GOAL } from "@/config/rewards";

function PracticeRowSkeleton() {
  return (
    <li className="flex flex-col rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-muted" />
        <div className="h-6 w-12 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-3 h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-1.5 w-full animate-pulse rounded-full bg-muted" />
      <div className="mt-3 flex items-center gap-2">
        <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-muted" />
        <div className="h-9 flex-1 animate-pulse rounded-xl bg-muted" />
      </div>
    </li>
  );
}

export function PracticesList() {
  const { practices, completions, byPracticeId, error, loading, reload } = useTrackerData();
  const { busyKey, onDone, onUndo } = useTrackerActions(reload);
  const [celebration, setCelebration] = useState<{
    coinsEarned: number;
    coinsBalance: number;
  } | null>(null);

  if (error && !loading) {
    return (
      <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <div className="mt-3 flex items-center gap-3">
              <button
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                onClick={() => void reload()}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {TRACKER_STRINGS.retry}
              </button>
              <a className="text-sm text-muted-foreground underline underline-offset-2" href="/login">
                {TRACKER_STRINGS.goToLogin}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading || !practices || !completions) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
        <ul className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <PracticeRowSkeleton key={i} />
          ))}
        </ul>
      </section>
    );
  }

  const totalToday = Object.values(byPracticeId).reduce((sum, c) => sum + c.count, 0);
  const maxTotal = practices.reduce((sum, p) => sum + p.maxPerDay, 0);

  async function handleDone(id: string) {
    const res = await onDone(id);
    if (res?.reward.milestoneHit) {
      setCelebration({ coinsEarned: res.reward.coinsEarned, coinsBalance: res.reward.coinsBalance });
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {TRACKER_STRINGS.todayPrefix} · {completions.dayKey}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {TRACKER_STRINGS.completedSummary(totalToday, maxTotal)}
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3">
        {practices.map((p) => (
          <PracticeRow
            key={p.id}
            practice={p}
            count={byPracticeId[p.id]?.count ?? 0}
            busy={busyKey === p.id}
            onDone={handleDone}
            onUndo={onUndo}
          />
        ))}
      </ul>

      <DailyGoalCelebration
        open={Boolean(celebration)}
        coinsEarned={celebration?.coinsEarned ?? 0}
        totalCoins={celebration?.coinsBalance ?? 0}
        dailyGoal={DAILY_COMPLETION_GOAL}
        onDismiss={() => setCelebration(null)}
      />
    </section>
  );
}
