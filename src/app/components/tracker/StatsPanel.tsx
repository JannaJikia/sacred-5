"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJson } from "@/lib/http/client";
import { UI_TEXT } from "@/config/uiText";
import { TrendingUp, Calendar } from "lucide-react";
import { STATS_STRINGS } from "@/config/strings/stats";
import { StatsPracticeBreakdownRow } from "@components/stats/StatsPracticeBreakdownRow";

type StatsResponse = {
  totals: { totalPoints: number; activeDays: number };
  perPractice: Array<{ practiceId: string; label: string; count: number; points: number }>;
};

/* ─── Skeleton ────────────────────────────────────────────────────── */
function StatsSkeleton() {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border bg-card p-4">
            <div className="h-7 w-16 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Main component ──────────────────────────────────────────────── */
export function StatsPanel() {
  const router = useRouter();
  const [data, setData] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setError(null);
      try {
        const stats = await fetchJson<StatsResponse>("/api/stats?range=week", {
          cache: "no-store",
        });
        if (!mounted) return;
        setData(stats);
      } catch (e: unknown) {
        const err = e as import("@/lib/http/client").HttpError;
        if (!mounted) return;
        if (err?.status === 401) {
          setError(UI_TEXT.auth.pleaseLogin);
          router.replace("/login");
        } else {
          setError(err?.message ?? UI_TEXT.errors.statsFailed);
        }
        setData(null);
      }
    };

    void load();
    const onUpdated = () => { void load(); };
    window.addEventListener("practice-updated", onUpdated);
    return () => {
      mounted = false;
      window.removeEventListener("practice-updated", onUpdated);
    };
  }, [router]);

  if (error) {
    return (
      <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
        {error}{" "}
        <a className="underline underline-offset-2" href="/login">
          {UI_TEXT.auth.loginCta}
        </a>
      </section>
    );
  }

  if (!data) return <StatsSkeleton />;

  const maxPoints = Math.max(1, ...data.perPractice.map((p) => p.points));

  return (
    <section className="space-y-4">
      {/* Summary metric cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">{STATS_STRINGS.weekPointsLabel}</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-primary">
            {data.totals.totalPoints}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{STATS_STRINGS.weekPointsHelp}</p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">{STATS_STRINGS.activeDaysLabel}</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-primary">
            {data.totals.activeDays}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{STATS_STRINGS.activeDaysHelp}</p>
        </div>
      </div>

      {/* Per-practice breakdown */}
      {data.perPractice.length > 0 && (
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">{STATS_STRINGS.breakdownTitle}</h3>
          <div className="space-y-4">
            {data.perPractice.map((p) => (
              <StatsPracticeBreakdownRow
                key={p.practiceId}
                practiceId={p.practiceId}
                label={p.label}
                count={p.count}
                points={p.points}
                maxPoints={maxPoints}
              />
            ))}
          </div>
        </div>
      )}

      {data.perPractice.length === 0 && (
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="text-3xl">🌱</div>
          <p className="mt-2 text-sm font-medium text-foreground">{STATS_STRINGS.emptyTitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">{STATS_STRINGS.emptyBody}</p>
        </div>
      )}
    </section>
  );
}
