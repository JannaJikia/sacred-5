import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { unauthorized, validationError, internalError } from "@/lib/http/errors";
import { isCustomPracticeIconKey } from "@/config/customPracticeIcons";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(60),
  points: z.number().int().min(1).max(50).optional(),
  maxPerDay: z.number().int().min(1).max(50).optional(),
  description: z.string().trim().max(200).optional(),
  iconKey: z.string().max(32).optional(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return validationError(z.treeifyError(parsed.error), "Invalid input");

  const id = crypto.randomUUID();
  const { name, description } = parsed.data;
  const points = parsed.data.points ?? 1;
  const maxPerDay = parsed.data.maxPerDay ?? 1;
  const iconKeyRaw = parsed.data.iconKey;
  const iconKey =
    iconKeyRaw && isCustomPracticeIconKey(iconKeyRaw) ? iconKeyRaw : null;

  try {
    const clash = await prisma.practice.findFirst({
      where: {
        archivedAt: null,
        OR: [{ ownerId: null }, { ownerId: user.id }],
        name: { equals: name, mode: Prisma.QueryMode.insensitive },
      },
      select: { id: true },
    });

    if (clash) {
      return validationError(
        { name: ["A practice with this name already exists. Pick a different name."] },
        "Invalid input"
      );
    }

    const practice = await prisma.$transaction(async (tx) => {
      const practice = await tx.practice.create({
        data: {
          id,
          name,
          description: description || null,
          iconKey,
          isCustom: true,
          ownerId: user.id,
          points,
          maxPerDay,
        },
        select: {
          id: true,
          name: true,
          description: true,
          iconKey: true,
          isCustom: true,
          points: true,
          maxPerDay: true,
        },
      });

      await tx.userPractice.create({
        data: { userId: user.id, practiceId: practice.id },
      });

      return practice;
    });

    return NextResponse.json({ practice }, { status: 201 });
  } catch (e) {
    console.error("PRACTICE_CUSTOM_CREATE_ERROR:", e);
    return internalError();
  }
}
