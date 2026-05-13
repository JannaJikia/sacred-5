export const CUSTOM_PRACTICE_ICON_KEYS = [
  "sparkles",
  "flame",
  "heart",
  "moon",
  "sun",
  "leaf",
  "zap",
  "music",
  "book",
  "coffee",
  "dumbbell",
  "brain",
] as const;

export type CustomPracticeIconKey = (typeof CUSTOM_PRACTICE_ICON_KEYS)[number];

export function isCustomPracticeIconKey(v: string): v is CustomPracticeIconKey {
  return (CUSTOM_PRACTICE_ICON_KEYS as readonly string[]).includes(v);
}
