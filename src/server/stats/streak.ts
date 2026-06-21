import "server-only";
import { parseDayKey } from "@/lib/time";
import type { Db } from "./types";
import { fetchActiveDayKeys } from "./repo";

const DAY_KEY_FMT = "yyyy-LL-dd";

function prevDayKey(dayKey: string): string {
  return parseDayKey(dayKey).minus({ days: 1 }).toFormat(DAY_KEY_FMT);
}

/**
 * Current streak: consecutive days with at least one completion, counting back
 * from today. An unlogged "today" does not break a standing streak (grace), so
 * the streak only resets once a full day passes with no activity.
 */
export async function getCurrentStreak(
  db: Db,
  userId: string,
  asOfDayKey: string,
  windowDays = 400
): Promise<number> {
  const start = parseDayKey(asOfDayKey).minus({ days: windowDays }).toFormat(DAY_KEY_FMT);
  const active = new Set(await fetchActiveDayKeys(db, userId, start, asOfDayKey));

  let cursor = asOfDayKey;
  if (!active.has(cursor)) cursor = prevDayKey(cursor); // grace for today

  let streak = 0;
  while (active.has(cursor)) {
    streak += 1;
    cursor = prevDayKey(cursor);
  }
  return streak;
}
