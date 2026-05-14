import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "@/lib/db";
import { applyCompletion } from "@/server/tracker/applyCompletion";
import { undoCompletion } from "@/server/completions/undoCompletion";
import { done } from "@/server/tracker/done";
import { MILESTONE_REWARD_COINS, REWARD_KEY_FIVE_COMPLETIONS } from "@/config/rewards";

describe("integration: tracker business rules", () => {
  beforeAll(() => {
    const url = process.env.DATABASE_URL ?? "";
    expect(url).toContain("isha_practice_test");
  });

  beforeEach(async () => {
    await prisma.dailyPracticeCompletion.deleteMany();
    await prisma.dailyRewardClaim.deleteMany();
    await prisma.session.deleteMany();
    await prisma.userPractice.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("applyCompletion creates + increments + then blocks at maxPerDay", async () => {
    const user = await prisma.user.create({
      data: { email: "u_apply@test.local", passwordHash: "x" },
      select: { id: true },
    });

    const dayKey = "2026-01-07";
    const now = new Date();
    const practiceId = "walk";
    const maxPerDay = 2;

    await prisma.practice.upsert({
      where: { id: practiceId },
      update: { name: "Walk", maxPerDay, isCustom: false },
      create: { id: practiceId, name: "Walk", maxPerDay, isCustom: false },
    });

    const r1 = await prisma.$transaction((tx) =>
      applyCompletion(tx, { userId: user.id, practiceId, dayKey, delta: 1, maxPerDay, now })
    );
    expect(r1.kind).toBe("ok");
    if (r1.kind === "ok") expect(r1.row.count).toBe(1);

    const r2 = await prisma.$transaction((tx) =>
      applyCompletion(tx, { userId: user.id, practiceId, dayKey, delta: 1, maxPerDay, now })
    );
    expect(r2.kind).toBe("ok");
    if (r2.kind === "ok") expect(r2.row.count).toBe(2);

    const r3 = await prisma.$transaction((tx) =>
      applyCompletion(tx, { userId: user.id, practiceId, dayKey, delta: 1, maxPerDay, now })
    );
    expect(r3.kind).toBe("max_reached");
  });

  it("undoCompletion decrements, deletes, and noops", async () => {
    const user = await prisma.user.create({
      data: { email: "u_undo@test.local", passwordHash: "x" },
      select: { id: true },
    });

    const dayKey = "2026-01-08";
    const practiceId = "walk";

    await prisma.practice.upsert({
      where: { id: practiceId },
      update: { name: "Walk", isCustom: false },
      create: { id: practiceId, name: "Walk", isCustom: false },
    });

    await prisma.dailyPracticeCompletion.create({
      data: { userId: user.id, practiceId, dayKey, count: 2, lastCompletedAt: new Date() },
    });

    const u1 = await prisma.$transaction((tx) =>
      undoCompletion(tx, { userId: user.id, practiceId, dayKey, delta: 1 })
    );
    expect(u1.kind).toBe("ok");
    if (u1.kind === "ok") expect(u1.row.count).toBe(1);

    const u2 = await prisma.$transaction((tx) =>
      undoCompletion(tx, { userId: user.id, practiceId, dayKey, delta: 1 })
    );
    expect(u2.kind).toBe("deleted");

    const u3 = await prisma.$transaction((tx) =>
      undoCompletion(tx, { userId: user.id, practiceId, dayKey, delta: 1 })
    );
    expect(u3.kind).toBe("noop");
  });

  it("applyCompletion returns max_reached when delta > maxPerDay", async () => {
    const user = await prisma.user.create({
      data: { email: "u_test3@test.local", passwordHash: "x" },
      select: { id: true },
    });

    const dayKey = "2026-01-07";
    const now = new Date();
    const practiceId = "walk";
    const maxPerDay = 2;

    await prisma.practice.upsert({
      where: { id: practiceId },
      update: { name: "Walk", isCustom: false },
      create: { id: practiceId, name: "Walk", isCustom: false },
    });

    const r = await prisma.$transaction((tx) =>
      applyCompletion(tx, { userId: user.id, practiceId, dayKey, delta: 3, maxPerDay, now })
    );

    expect(r.kind).toBe("max_reached");

    const rows = await prisma.dailyPracticeCompletion.findMany({ where: { userId: user.id } });
    expect(rows).toHaveLength(0);
  });

  it("undoCompletion deletes when count equals delta (exactly reaches 0)", async () => {
    const user = await prisma.user.create({
      data: { email: "u_test4@test.local", passwordHash: "x" },
      select: { id: true },
    });

    const dayKey = "2026-01-07";
    const practiceId = "walk";

    await prisma.practice.upsert({
      where: { id: practiceId },
      update: { name: "Walk", isCustom: false },
      create: { id: practiceId, name: "Walk", isCustom: false },
    });

    await prisma.dailyPracticeCompletion.create({
      data: { userId: user.id, practiceId, dayKey, count: 1, lastCompletedAt: new Date() },
    });

    const u = await prisma.$transaction((tx) =>
      undoCompletion(tx, { userId: user.id, practiceId, dayKey, delta: 1 })
    );

    expect(u.kind).toBe("deleted");

    const row = await prisma.dailyPracticeCompletion.findUnique({
      where: { userId_practiceId_dayKey: { userId: user.id, practiceId, dayKey } },
    });
    expect(row).toBeNull();
  });

  it("done awards coins once when daily completion total crosses goal", async () => {
    const user = await prisma.user.create({
      data: { email: "u_done_goal@test.local", passwordHash: "x", coins: 0 },
      select: { id: true },
    });

    const practiceId = "walk_goal";
    const dayKey = "2026-03-15";
    const now = new Date();

    await prisma.practice.upsert({
      where: { id: practiceId },
      update: { name: "Walk goal", maxPerDay: 10, isCustom: false },
      create: { id: practiceId, name: "Walk goal", maxPerDay: 10, isCustom: false },
    });

    await prisma.userPractice.create({
      data: { userId: user.id, practiceId },
    });

    for (let i = 0; i < 4; i++) {
      const r = await done({ userId: user.id, practiceId, dayKey, now });
      expect(r.kind).toBe("ok");
      if (r.kind === "ok") {
        expect(r.reward.milestoneHit).toBe(false);
        expect(r.reward.coinsEarned).toBe(0);
      }
    }

    const fifth = await done({ userId: user.id, practiceId, dayKey, now });
    expect(fifth.kind).toBe("ok");
    if (fifth.kind === "ok") {
      expect(fifth.reward.milestoneHit).toBe(true);
      expect(fifth.reward.coinsEarned).toBe(MILESTONE_REWARD_COINS);
      expect(fifth.reward.totalToday).toBe(5);
    }

    const uAfter = await prisma.user.findUnique({ where: { id: user.id }, select: { coins: true } });
    expect(uAfter?.coins).toBe(MILESTONE_REWARD_COINS);

    const claim = await prisma.dailyRewardClaim.findUnique({
      where: {
        userId_dayKey_rewardKey: {
          userId: user.id,
          dayKey,
          rewardKey: REWARD_KEY_FIVE_COMPLETIONS,
        },
      },
    });
    expect(claim).not.toBeNull();

    const sixth = await done({ userId: user.id, practiceId, dayKey, now });
    expect(sixth.kind).toBe("ok");
    if (sixth.kind === "ok") {
      expect(sixth.reward.milestoneHit).toBe(false);
      expect(sixth.reward.coinsEarned).toBe(0);
    }

    const uFinal = await prisma.user.findUnique({ where: { id: user.id }, select: { coins: true } });
    expect(uFinal?.coins).toBe(MILESTONE_REWARD_COINS);
  });
});
