import type { DailyPracticeCompletion } from "@prisma/client";

import { prisma } from "@/lib/db";
import { dayKeyNow } from "@/lib/time";
import { applyCompletion } from "@/server/tracker/applyCompletion";
import {
  DAILY_COMPLETION_GOAL,
  MILESTONE_REWARD_COINS,
  REWARD_KEY_FIVE_COMPLETIONS,
} from "@/config/rewards";
import { CELEBRATION_STRINGS } from "@/config/strings/tracker";

export type DoneReward = {
  milestoneHit: boolean;
  coinsEarned: number;
  totalToday: number;
  coinsBalance: number;
  /** Shown when this is the user’s first reward claim ever (e.g. “1st milestone”). */
  celebrationBadge: string | null;
};

export type DoneResult =
  | {
      kind: "ok";
      completion: DailyPracticeCompletion;
      dayKey: string;
      practiceId: string;
      maxPerDay: number;
      reward: DoneReward;
    }
  | {
      kind: "max_reached";
      practiceId: string;
      dayKey: string;
      maxPerDay: number;
      count: number;
    }
  | { kind: "invalid_practice" };

export async function done(params: {
  userId: string;
  practiceId: string;
  delta?: number;
  dayKey?: string;
  now?: Date;
}): Promise<DoneResult> {
  const dayKey = params.dayKey ?? dayKeyNow();
  const now = params.now ?? new Date();
  const delta = params.delta ?? 1;
  const practiceId = params.practiceId;

  const result = await prisma.$transaction(async (tx) => {
    const practice = await tx.practice.findFirst({
      where: {
        id: practiceId,
        archivedAt: null,
        userPractices: { some: { userId: params.userId } },
      },
      select: { id: true, maxPerDay: true },
    });

    if (!practice) return { kind: "invalid_practice" } as const;

    const applied = await applyCompletion(tx, {
      userId: params.userId,
      practiceId,
      dayKey,
      delta,
      maxPerDay: practice.maxPerDay,
      now,
    });

    if (applied.kind === "max_reached") {
      return {
        kind: "max_reached",
        practiceId,
        dayKey,
        maxPerDay: practice.maxPerDay,
        count: applied.count,
      } as const;
    }

    const sumAgg = await tx.dailyPracticeCompletion.aggregate({
      where: { userId: params.userId, dayKey },
      _sum: { count: true },
    });
    const totalToday = sumAgg._sum.count ?? 0;
    const prevTotal = totalToday - delta;

    let milestoneHit = false;
    let coinsEarned = 0;
    let celebrationBadge: string | null = null;

    if (prevTotal < DAILY_COMPLETION_GOAL && totalToday >= DAILY_COMPLETION_GOAL) {
      const claimsBefore = await tx.dailyRewardClaim.count({
        where: { userId: params.userId },
      });

      const claim = await tx.dailyRewardClaim.createMany({
        data: [
          {
            userId: params.userId,
            dayKey,
            rewardKey: REWARD_KEY_FIVE_COMPLETIONS,
          },
        ],
        skipDuplicates: true,
      });
      if (claim.count === 1) {
        await tx.user.update({
          where: { id: params.userId },
          data: { coins: { increment: MILESTONE_REWARD_COINS } },
        });
        milestoneHit = true;
        coinsEarned = MILESTONE_REWARD_COINS;
        if (claimsBefore === 0) {
          celebrationBadge = CELEBRATION_STRINGS.badgeFirstMilestone;
        }
      }
    }

    const userRow = await tx.user.findUnique({
      where: { id: params.userId },
      select: { coins: true },
    });

    return {
      kind: "ok" as const,
      completion: applied.row,
      dayKey,
      practiceId,
      maxPerDay: practice.maxPerDay,
      reward: {
        milestoneHit,
        coinsEarned,
        totalToday,
        coinsBalance: userRow?.coins ?? 0,
        celebrationBadge,
      },
    };
  });

  return result;
}
