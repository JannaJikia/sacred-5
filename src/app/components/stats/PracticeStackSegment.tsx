"use client";

import { practiceVisual } from "@/lib/practices/practiceVisual";
import { cn } from "@/lib/utils";

/** Single vertical slice in the weekly stacked chart. */
export function PracticeStackSegment({
  practiceId,
  name,
  heightPct,
}: {
  practiceId: string;
  name: string;
  heightPct: number;
}) {
  const v = practiceVisual({ id: practiceId, name });
  return (
    <div
      className={cn("w-full min-h-[2px] rounded-sm bg-gradient-to-t", v.gradient)}
      style={{ height: `${heightPct}%` }}
      title={name}
    />
  );
}
