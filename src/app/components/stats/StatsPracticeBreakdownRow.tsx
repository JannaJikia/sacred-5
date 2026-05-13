"use client";

import { practiceVisual } from "@/lib/practices/practiceVisual";
import { cn } from "@/lib/utils";
import { formatPointsShort } from "@/lib/formatPoints";
import { PracticeProgressBar } from "@components/tracker/PracticeProgressBar";

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function StatsPracticeBreakdownRow({
  practiceId,
  label,
  count,
  points,
  maxPoints,
}: {
  practiceId: string;
  label: string;
  count: number;
  points: number;
  maxPoints: number;
}) {
  const v = practiceVisual({ id: practiceId, name: label });
  const Icon = v.icon;
  const pct = clamp01(points / maxPoints);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br text-white",
              v.gradient
            )}
          >
            <Icon className="h-3 w-3" aria-hidden />
          </div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="text-muted-foreground">{count}×</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              v.lightBg,
              v.lightText
            )}
          >
            {formatPointsShort(points)}
          </span>
        </div>
      </div>
      <PracticeProgressBar fraction={pct} barClassName={v.bar} />
    </div>
  );
}
