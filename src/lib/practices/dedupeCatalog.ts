import { PRACTICE_KEYS } from "@/config/practices";

export type PracticeRow = {
  id: string;
  name: string;
  isCustom: boolean;
};

const DEDUPE_SUFFIX = /\s+(goal|copy|2|ii|dup|duplicate)\s*$/i;

/** Normalize names so "Walk goal" and "Walk" collapse for catalog dedupe. */
export function normalizePracticeCatalogKey(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(DEDUPE_SUFFIX, "")
    .replace(/\s+/g, " ");
}

function rankForDedupe(p: PracticeRow): number {
  if (!p.isCustom) return 0;
  if (PRACTICE_KEYS.includes(p.id as (typeof PRACTICE_KEYS)[number])) return 0;
  return 1;
}

/** Prefer built-ins / seed keys over similar-looking custom duplicates in the picker catalog. */
export function dedupePracticeCatalog<T extends PracticeRow>(list: T[]): T[] {
  const hasWalk = list.some((p) => p.id === "walk");
  const filtered = hasWalk ? list.filter((p) => p.id !== "walk_goal") : list;

  const sorted = [...filtered].sort((a, b) => {
    const rk = rankForDedupe(a) - rankForDedupe(b);
    if (rk !== 0) return rk;
    const nk = normalizePracticeCatalogKey(a.name).localeCompare(normalizePracticeCatalogKey(b.name));
    if (nk !== 0) return nk;
    return a.name.localeCompare(b.name);
  });

  const best = new Map<string, T>();
  for (const p of sorted) {
    const key = normalizePracticeCatalogKey(p.name);
    const cur = best.get(key);
    if (!cur) {
      best.set(key, p);
      continue;
    }
    const pick =
      rankForDedupe(p) < rankForDedupe(cur)
        ? p
        : rankForDedupe(p) > rankForDedupe(cur)
          ? cur
          : PRACTICE_KEYS.includes(p.id as (typeof PRACTICE_KEYS)[number]) &&
              !PRACTICE_KEYS.includes(cur.id as (typeof PRACTICE_KEYS)[number])
            ? p
            : cur;
    best.set(key, pick);
  }

  return Array.from(best.values()).sort((a, b) => {
    if (a.isCustom !== b.isCustom) return a.isCustom ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
}
