import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { dayKeyNow } from "@/lib/time";
import { prisma } from "@/lib/db";
import { unauthorized, internalError } from "@/lib/http/errors";
import { getCurrentStreak } from "@/server/stats/streak";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  try {
    const streak = await getCurrentStreak(prisma, user.id, dayKeyNow());
    return NextResponse.json({ streak }, { status: 200 });
  } catch (e) {
    console.error("STREAK_ERROR:", e);
    return internalError();
  }
}
