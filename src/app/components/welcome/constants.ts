import { Brain, Flame, Footprints, NotebookPen, ShieldCheck, Snowflake, TrendingUp } from "lucide-react";
import type React from "react";
import { PRACTICES, type PracticeKey } from "@/config/practices";

export type WelcomeIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

const DESCRIPTIONS: Record<PracticeKey, string> = {
  walk: "Clear your head with mindful movement, indoors or out.",
  cold_shower: "Two cold minutes that wake up the whole day.",
  journal: "Put the noise on paper and think a little straighter.",
  meditation: "Sit, breathe, and widen the gap before you react.",
};

const ICONS: Record<PracticeKey, WelcomeIcon> = {
  walk: Footprints,
  cold_shower: Snowflake,
  journal: NotebookPen,
  meditation: Brain,
};

function cadence(maxPerDay: number): string {
  return maxPerDay === 1 ? "Once a day" : `Up to ${maxPerDay}× a day`;
}

export type PracticeCard = {
  key: PracticeKey;
  label: string;
  description: string;
  points: number;
  cadence: string;
  icon: WelcomeIcon;
};

export const practices: PracticeCard[] = PRACTICES.map((p) => ({
  key: p.key,
  label: p.label,
  description: DESCRIPTIONS[p.key],
  points: p.points,
  cadence: cadence(p.maxPerDay),
  icon: ICONS[p.key],
}));

export type Feature = {
  icon: WelcomeIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: Flame,
    title: "Streaks you can trust",
    description:
      "Log each practice in a single tap. Daily caps stop you inflating the count, so the streak you see is the streak you earned.",
  },
  {
    icon: TrendingUp,
    title: "Progress you can read",
    description: "Weekly and monthly views show which practices are sticking and which one needs attention this week.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description: "No ads, no feed, no follower count. Session auth keeps the data yours and no one else's.",
  },
];

/** Sample data for the marketing weekly chart. Clearly illustrative, not real user data. */
export const sampleWeek: { label: string; sessions: number; fill: number }[] = [
  { label: "Walk", sessions: 11, fill: 0.85 },
  { label: "Cold shower", sessions: 6, fill: 0.6 },
  { label: "Journal", sessions: 7, fill: 1 },
  { label: "Meditation", sessions: 9, fill: 0.72 },
];
