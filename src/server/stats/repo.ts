import type { Db } from "./types";

export async function fetchSelectedPractices(db: Db, userId: string) {
  const rows = await db.userPractice.findMany({
    where: { userId },
    select: {
      practice: {
        select: { id: true, name: true, points: true, maxPerDay: true, archivedAt: true },
      },
    },
    orderBy: { practiceId: "asc" },
  });

  return rows.map((r) => r.practice).filter((p) => !p.archivedAt);
}

export async function fetchCountByPractice(db: Db, userId: string, whereRange: object) {
  const rows = await db.dailyPracticeCompletion.groupBy({
    by: ["practiceId"],
    where: { userId, ...whereRange },
    _sum: { count: true },
  });

  const out: Record<string, number> = {};
  for (const r of rows) out[r.practiceId] = r._sum.count ?? 0;
  return out;
}

export async function fetchActiveDays(db: Db, userId: string, whereRange: object) {
  const rows = await db.dailyPracticeCompletion.groupBy({
    by: ["dayKey"],
    where: { userId, ...whereRange },
    _sum: { count: true },
  });

  // robust even if you later allow count=0 rows
  return rows.filter((r) => (r._sum.count ?? 0) > 0).length;
}

/** Distinct day keys (in [gte, lte]) on which the user completed at least one practice. */
export async function fetchActiveDayKeys(db: Db, userId: string, gteDayKey: string, lteDayKey: string) {
  const rows = await db.dailyPracticeCompletion.groupBy({
    by: ["dayKey"],
    where: { userId, count: { gt: 0 }, dayKey: { gte: gteDayKey, lte: lteDayKey } },
  });
  return rows.map((r) => r.dayKey);
}

export async function fetchDailyPracticeSums(db: Db, userId: string, whereRange: object) {
  const rows = await db.dailyPracticeCompletion.groupBy({
    by: ["dayKey", "practiceId"],
    where: { userId, ...whereRange },
    _sum: { count: true },
  });

  return rows.map((r) => ({
    dayKey: r.dayKey,
    practiceId: r.practiceId,
    count: r._sum.count ?? 0,
  }));
}
