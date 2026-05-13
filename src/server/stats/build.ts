import { eachDayKeyInclusive } from "@/lib/time/dayRange";

export type PracticeForStats = { id: string; name: string; points: number; maxPerDay: number };

export type DailyStackedDay = {
  dayKey: string;
  segments: Array<{ practiceId: string; label: string; points: number }>;
  totalPoints: number;
};

export function buildPerPractice(
  practices: PracticeForStats[],
  countByPractice: Record<string, number>
) {
  return practices.map((p) => {
    const count = countByPractice[p.id] ?? 0;
    const points = count * p.points;
    return {
      practiceId: p.id,
      label: p.name,
      maxPerDay: p.maxPerDay,
      pointsPer: p.points,
      count,
      points,
    };
  });
}

export function buildDailySeries(
  practices: PracticeForStats[],
  rows: Array<{ dayKey: string; practiceId: string; count: number }>
) {
  const byDay: Record<string, { dayKey: string; totalCount: number; totalPoints: number }> = {};
  const pointsById = Object.fromEntries(practices.map((p) => [p.id, p.points]));

  for (const r of rows) {
    const pointsPer = pointsById[r.practiceId];
    if (typeof pointsPer !== "number") continue;
    const pts = r.count * pointsPer;

    const slot = (byDay[r.dayKey] ??= { dayKey: r.dayKey, totalCount: 0, totalPoints: 0 });
    slot.totalCount += r.count;
    slot.totalPoints += pts;
  }

  return Object.values(byDay).sort((a, b) => a.dayKey.localeCompare(b.dayKey));
}

export function buildDailyStackedTimeline(
  practices: PracticeForStats[],
  rows: Array<{ dayKey: string; practiceId: string; count: number }>,
  startDayKey: string,
  endDayKey: string
): DailyStackedDay[] {
  const pointsById = Object.fromEntries(practices.map((p) => [p.id, p.points]));
  const labelById = Object.fromEntries(practices.map((p) => [p.id, p.name]));

  const byDay = new Map<string, Map<string, number>>();
  for (const r of rows) {
    const pp = pointsById[r.practiceId];
    if (typeof pp !== "number") continue;
    const pts = r.count * pp;
    if (!pts) continue;
    const m = byDay.get(r.dayKey) ?? new Map();
    m.set(r.practiceId, (m.get(r.practiceId) ?? 0) + pts);
    byDay.set(r.dayKey, m);
  }

  const days = eachDayKeyInclusive(startDayKey, endDayKey);
  return days.map((dayKey) => {
    const m = byDay.get(dayKey) ?? new Map();
    const segments = [...m.entries()]
      .map(([practiceId, points]) => ({
        practiceId,
        label: labelById[practiceId] ?? practiceId,
        points,
      }))
      .filter((s) => s.points > 0)
      .sort((a, b) => b.points - a.points);
    const totalPoints = segments.reduce((a, s) => a + s.points, 0);
    return { dayKey, segments, totalPoints };
  });
}
