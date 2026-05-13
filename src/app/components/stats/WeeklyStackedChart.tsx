"use client";

import { PracticeStackSegment } from "./PracticeStackSegment";

export type DailyStackedDay = {
  dayKey: string;
  segments: Array<{ practiceId: string; label: string; points: number }>;
  totalPoints: number;
};

export function WeeklyStackedChart({
  days,
  labelShort = (dk: string) => dk.slice(5).replace("-", "/"),
}: {
  days: DailyStackedDay[];
  labelShort?: (dayKey: string) => string;
}) {
  const maxPts = Math.max(1, ...days.map((d) => d.totalPoints));

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex h-[140px] min-w-0 items-end gap-1.5">
        {days.map((d) => {
          const barHeightPx = Math.max(10, (d.totalPoints / maxPts) * 118);
          return (
            <div key={d.dayKey} className="flex min-w-[28px] flex-1 flex-col items-center justify-end gap-1">
              <div
                className="flex w-full flex-col-reverse overflow-hidden rounded-md bg-muted/60"
                style={{ height: barHeightPx }}
                title={`${d.dayKey}: ${d.totalPoints} points`}
              >
                {d.segments.map((s) => {
                  const segH = d.totalPoints > 0 ? (s.points / d.totalPoints) * 100 : 0;
                  return (
                    <PracticeStackSegment
                      key={s.practiceId}
                      practiceId={s.practiceId}
                      name={s.label}
                      heightPct={segH}
                    />
                  );
                })}
              </div>
              <span className="max-w-full truncate text-[10px] font-medium text-muted-foreground">
                {labelShort(d.dayKey)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
