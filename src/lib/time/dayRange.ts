import { DateTime } from "luxon";

const APP_TZ = process.env.APP_TZ ?? "Asia/Tbilisi";
const DAY_KEY_FMT = "yyyy-LL-dd";

/** Inclusive list of day keys from start through end (inclusive), in `APP_TZ`. */
export function eachDayKeyInclusive(startDayKey: string, endDayKey: string): string[] {
  const start = DateTime.fromFormat(startDayKey, DAY_KEY_FMT, { zone: APP_TZ }).startOf("day");
  const end = DateTime.fromFormat(endDayKey, DAY_KEY_FMT, { zone: APP_TZ }).startOf("day");
  if (!start.isValid || !end.isValid || end < start) return [];

  const out: string[] = [];
  for (let d = start; d <= end; d = d.plus({ days: 1 })) {
    out.push(d.toFormat(DAY_KEY_FMT));
  }
  return out;
}
