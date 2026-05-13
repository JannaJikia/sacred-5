import type { PracticeDto } from "@/lib/http/api";
import {
  CUSTOM_PRACTICE_ICON_KEYS,
  type CustomPracticeIconKey,
} from "@/config/customPracticeIcons";

const EMOJI_BY_ID: Record<string, string> = {
  walk: "🚶",
  cold_shower: "🧊",
  journal: "📓",
  meditation: "🧘",
};

const EMOJI_BY_ICON_KEY: Record<CustomPracticeIconKey, string> = {
  sparkles: "✨",
  flame: "🔥",
  heart: "❤️",
  moon: "🌙",
  sun: "☀️",
  leaf: "🌿",
  zap: "⚡",
  music: "🎵",
  book: "📖",
  coffee: "☕",
  dumbbell: "🏋️",
  brain: "🧠",
};

function emojiFromName(name: string): string {
  if (/walk|step|hike|run/i.test(name)) return "🚶";
  if (/cold|shower|ice|bath/i.test(name)) return "🧊";
  if (/journal|diary|write|note/i.test(name)) return "📓";
  if (/meditat|breath|mindful|pranayama/i.test(name)) return "🧘";
  return "✨";
}

function isIconKey(v: string | null | undefined): v is CustomPracticeIconKey {
  return Boolean(v && (CUSTOM_PRACTICE_ICON_KEYS as readonly string[]).includes(v));
}

export function practiceEmoji(p: Pick<PracticeDto, "id" | "name" | "iconKey">): string {
  if (isIconKey(p.iconKey)) {
    return EMOJI_BY_ICON_KEY[p.iconKey];
  }
  return EMOJI_BY_ID[p.id] ?? emojiFromName(p.name);
}
