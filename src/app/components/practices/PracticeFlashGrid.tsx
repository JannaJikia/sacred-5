"use client";

import type { PracticeDto } from "@/lib/http/api";
import { practiceEmoji } from "@/config/practicePresentation";
import { formatPointsShort } from "@/lib/formatPoints";
import { cn } from "@/lib/utils";
import { PRACTICES_STRINGS } from "@/config/strings/practices";
import { MAX_SELECTED } from "./usePracticePicker";

export function PracticeFlashGrid({
  items,
  selectedIds,
  onToggle,
}: {
  items: PracticeDto[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const selectedCount = selectedIds.length;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((p) => {
        const on = selectedIds.includes(p.id);
        const disableTurnOn = !on && selectedCount >= MAX_SELECTED;
        const emoji = practiceEmoji(p);

        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={on}
            disabled={disableTurnOn}
            onClick={() => onToggle(p.id)}
            className={cn(
              "group relative flex min-h-[120px] flex-col rounded-2xl border-2 p-4 text-left shadow-sm transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              on
                ? "border-primary bg-gradient-to-br from-primary/15 via-card to-card ring-2 ring-primary/30"
                : "border-border bg-card hover:border-primary/40",
              disableTurnOn && "opacity-45 hover:translate-y-0"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-3xl drop-shadow-sm" aria-hidden>
                {emoji}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {on ? PRACTICES_STRINGS.cardSelected : PRACTICES_STRINGS.cardTapHint}
              </span>
            </div>
            <div className="mt-3 flex-1">
              <div className="font-semibold leading-snug text-foreground">{p.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {formatPointsShort(p.points)} · max {p.maxPerDay}/day
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
