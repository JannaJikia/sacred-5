import type { LucideIcon } from "lucide-react";
import { Activity, BookOpen, Droplets, Sparkles } from "lucide-react";

/**
 * Shared visuals for practices (tracker, stats, charts).
 * `gradient` is only color stops — combine with `bg-gradient-to-br` | `bg-gradient-to-t`.
 * `bar` is a full Tailwind background class for horizontal progress fills.
 */
export type PracticeVisual = {
  icon: LucideIcon;
  gradient: string;
  lightBg: string;
  lightText: string;
  bar: string;
};

const WALK: PracticeVisual = {
  icon: Activity,
  gradient: "from-emerald-400 to-teal-500",
  lightBg: "bg-emerald-50 dark:bg-emerald-950/40",
  lightText: "text-emerald-700 dark:text-emerald-300",
  bar: "bg-gradient-to-r from-emerald-400 to-teal-500",
};

const COLD_SHOWER: PracticeVisual = {
  icon: Droplets,
  gradient: "from-sky-400 to-cyan-500",
  lightBg: "bg-sky-50 dark:bg-sky-950/40",
  lightText: "text-sky-700 dark:text-sky-300",
  bar: "bg-gradient-to-r from-sky-400 to-cyan-500",
};

const JOURNAL: PracticeVisual = {
  icon: BookOpen,
  gradient: "from-amber-400 to-orange-500",
  lightBg: "bg-amber-50 dark:bg-amber-950/40",
  lightText: "text-amber-700 dark:text-amber-300",
  bar: "bg-gradient-to-r from-amber-400 to-orange-500",
};

const MEDITATION: PracticeVisual = {
  icon: Sparkles,
  gradient: "from-violet-400 to-purple-500",
  lightBg: "bg-violet-50 dark:bg-violet-950/40",
  lightText: "text-violet-700 dark:text-violet-300",
  bar: "bg-gradient-to-r from-violet-400 to-purple-500",
};

const BY_ID: Record<string, PracticeVisual> = {
  walk: WALK,
  walk_goal: WALK,
  cold_shower: COLD_SHOWER,
  journal: JOURNAL,
  meditation: MEDITATION,
};

const BY_NAME: Array<{ match: RegExp; style: PracticeVisual }> = [
  { match: /walk|step|run|hike/i, style: WALK },
  { match: /cold|shower|ice|bath/i, style: COLD_SHOWER },
  { match: /journal|write|diary|note/i, style: JOURNAL },
  { match: /meditat|breath|pranayama|mindful/i, style: MEDITATION },
];

const DEFAULT: PracticeVisual = {
  icon: Activity,
  gradient: "from-primary/70 to-primary",
  lightBg: "bg-primary/10",
  lightText: "text-primary",
  bar: "bg-gradient-to-r from-primary/70 to-primary",
};

export function practiceVisual(input: { id: string; name: string }): PracticeVisual {
  const byId = BY_ID[input.id];
  if (byId) return byId;
  for (const entry of BY_NAME) {
    if (entry.match.test(input.name)) return entry.style;
  }
  return DEFAULT;
}
