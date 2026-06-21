"use client";

import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PracticeDto } from "@/lib/http/api";
import { practiceEmoji } from "@/config/practicePresentation";
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
  const emoji = practiceEmoji(practice);
  const progress = Math.min(1, count / practice.maxPerDay);
  const isComplete = count >= practice.maxPerDay;
  const disabledDone = busy || isComplete;
  const disabledUndo = busy || count <= 0;

  return (
    <li
      className={cn(
        "group flex flex-col rounded-2xl border bg-card p-4 shadow-sm transition-all duration-200",
        isComplete ? "border-primary/20 bg-primary/5" : "hover:border-border/80 hover:shadow-md"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-sm",
            style.gradient
          )}
          aria-hidden
        >
          <span className="drop-shadow-sm">{emoji}</span>
        </div>

        <div
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-sm font-bold tabular-nums",
            isComplete ? "bg-primary text-primary-foreground" : `${style.lightBg} ${style.lightText}`
          )}
        >
          {count}
          <span className="font-normal opacity-60">/{practice.maxPerDay}</span>
        </div>
      </div>

      <h3 className="mt-3 truncate text-sm font-semibold leading-snug text-foreground">{practice.name}</h3>

      <PracticeProgressBar className="mt-2" fraction={progress} barClassName={style.bar} />

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          aria-label={`${TRACKER_STRINGS.undo} ${practice.name}`}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all",
            disabledUndo
              ? "cursor-not-allowed border-border text-muted-foreground opacity-40"
              : "border-border text-muted-foreground hover:border-foreground/30 hover:bg-muted hover:text-foreground active:scale-95"
          )}
          disabled={disabledUndo}
          onClick={() => void onUndo(practice.id)}
        >
          <Minus className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label={`${TRACKER_STRINGS.markDone} ${practice.name}`}
          className={cn(
            "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-all",
            disabledDone
              ? "cursor-not-allowed bg-muted text-muted-foreground opacity-40"
              : `bg-gradient-to-r ${style.gradient} text-white shadow-sm hover:opacity-90 active:scale-95`
          )}
          disabled={disabledDone}
          onClick={() => void onDone(practice.id)}
        >
          {busy ? (
            <span className="animate-pulse">{TRACKER_STRINGS.busyEllipsis}</span>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              {isComplete ? TRACKER_STRINGS.done : TRACKER_STRINGS.markDone}
            </>
          )}
        </button>
      </div>
    </li>
  );
}
