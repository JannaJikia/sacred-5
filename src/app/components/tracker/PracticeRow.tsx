"use client";

import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PracticeDto } from "@/lib/http/api";
import { practiceEmoji } from "@/config/practicePresentation";
import { formatPointsShort } from "@/lib/formatPoints";
import { practiceVisual } from "@/lib/practices/practiceVisual";
import { PracticeProgressBar } from "./PracticeProgressBar";
import { TRACKER_STRINGS } from "@/config/strings/tracker";

export function PracticeRow({
  practice,
  count,
  busy,
  onDone,
  onUndo,
}: {
  practice: PracticeDto;
  count: number;
  busy: boolean;
  onDone: (id: string) => void | Promise<void>;
  onUndo: (id: string) => void | Promise<void>;
}) {
  const style = practiceVisual({ id: practice.id, name: practice.name });
  const Icon = style.icon;
  const emoji = practiceEmoji(practice);
  const progress = Math.min(1, count / practice.maxPerDay);
  const isComplete = count >= practice.maxPerDay;
  const disabledDone = busy || isComplete;
  const disabledUndo = busy || count <= 0;

  const status = isComplete
    ? TRACKER_STRINGS.completedForToday
    : count > 0
      ? TRACKER_STRINGS.moreAvailable(practice.maxPerDay - count)
      : TRACKER_STRINGS.notStarted;

  return (
    <li
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200",
        isComplete ? "border-primary/20 bg-primary/5" : "hover:border-border/80 hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-sm transition-transform group-hover:scale-105",
            style.gradient
          )}
          aria-hidden
        >
          <span className="relative z-10 drop-shadow">{emoji}</span>
          <div className="absolute bottom-0.5 right-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold leading-snug text-foreground">{practice.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatPointsShort(practice.points)} each</p>
            </div>

            <div
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold",
                isComplete ? "bg-primary text-primary-foreground" : `${style.lightBg} ${style.lightText}`
              )}
            >
              <span>{count}</span>
              <span className="font-normal opacity-60">/ {practice.maxPerDay}</span>
            </div>
          </div>

          <PracticeProgressBar className="mt-3" fraction={progress} barClassName={style.bar} />

          <p className="mt-1.5 text-xs text-muted-foreground">{status}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all",
            disabledUndo
              ? "cursor-not-allowed border-border opacity-40 text-muted-foreground"
              : "border-border text-muted-foreground hover:border-foreground/30 hover:bg-muted hover:text-foreground active:scale-95"
          )}
          disabled={disabledUndo}
          onClick={() => void onUndo(practice.id)}
        >
          <Minus className="h-3.5 w-3.5" />
          {TRACKER_STRINGS.undo}
        </button>

        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
            disabledDone
              ? "cursor-not-allowed bg-muted opacity-40 text-muted-foreground"
              : `bg-gradient-to-r ${style.gradient} text-white shadow-sm hover:opacity-90 active:scale-95`
          )}
          disabled={disabledDone}
          onClick={() => void onDone(practice.id)}
        >
          {busy ? (
            <span className="animate-pulse">{TRACKER_STRINGS.busyEllipsis}</span>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              {isComplete ? TRACKER_STRINGS.done : TRACKER_STRINGS.markDone}
            </>
          )}
        </button>
      </div>
    </li>
  );
}
