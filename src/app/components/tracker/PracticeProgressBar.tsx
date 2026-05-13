"use client";

import { cn } from "@/lib/utils";

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function PracticeProgressBar({
  fraction,
  barClassName,
  className,
}: {
  fraction: number;
  barClassName: string;
  className?: string;
}) {
  const pct = clamp01(fraction);
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          barClassName
        )}
        style={{ width: `${pct * 100}%` }}
        aria-hidden
      />
    </div>
  );
}
