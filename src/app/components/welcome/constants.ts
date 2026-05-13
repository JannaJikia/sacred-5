import { Activity, BarChart3, BookOpen, Droplets, Flame, Shield, Sparkles } from "lucide-react";
import type React from "react";
import { PRACTICES, type PracticeKey } from "@/config/practices";
import { formatPointsShort } from "@/lib/formatPoints";

export type WelcomeIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

const DESCRIPTIONS: Record<PracticeKey, string> = {
  walk: "Ground yourself with mindful movement.",
  cold_shower: "Shock your system into full alertness.",
  journal: "Reflect, process, and clarify your mind.",
  meditation: "Still the noise. Deepen your awareness.",
};

const WELCOME_META: Record<
  PracticeKey,
  { icon: WelcomeIcon; gradient: string; badge: string; maxLabel: string }
> = {
  walk: {
    icon: Activity,
    gradient: "from-emerald-400 to-teal-500",
    badge: "bg-emerald-900/60 text-emerald-300",
    maxLabel: "2× daily",
  },
  cold_shower: {
    icon: Droplets,
    gradient: "from-sky-400 to-cyan-500",
    badge: "bg-sky-900/60 text-sky-300",
    maxLabel: "1× daily",
  },
  journal: {
    icon: BookOpen,
    gradient: "from-yellow-400 to-amber-500",
    badge: "bg-yellow-900/60 text-yellow-300",
    maxLabel: "1× daily",
  },
  meditation: {
    icon: Sparkles,
    gradient: "from-lime-400 to-green-500",
    badge: "bg-lime-900/60 text-lime-300",
    maxLabel: "2× daily",
  },
};

export type PracticeCard = {
  key: string;
  label: string;
  description: string;
  pointsBadge: string;
  max: string;
  icon: WelcomeIcon;
  gradient: string;
  badge: string;
};

export type Feature = {
  icon: WelcomeIcon;
  title: string;
  description: string;
};

export const practices: PracticeCard[] = PRACTICES.map((p) => {
  const m = WELCOME_META[p.key];
  return {
    key: p.key,
    label: p.label,
    description: DESCRIPTIONS[p.key],
    pointsBadge: formatPointsShort(p.points),
    max: m.maxLabel,
    icon: m.icon,
    gradient: m.gradient,
    badge: m.badge,
  };
});

export const features: Feature[] = [
  {
    icon: Flame,
    title: "Build streaks",
    description:
      "Log each practice in one tap. Daily counts and per-day limits keep things real — no inflating the numbers.",
  },
  {
    icon: BarChart3,
    title: "See your progress",
    description:
      "Weekly and monthly stats show exactly which practices you're nailing and where you can push further.",
  },
  {
    icon: Shield,
    title: "Private by design",
    description: "No ads. No social feed. Just you and your discipline. Secure session auth, your data only.",
  },
];

export const statWidths = ["85%", "60%", "100%", "70%"] as const;
