import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { unauthorized, internalError } from "@/lib/http/errors";
import { dedupePracticeCatalog } from "@/lib/practices/dedupeCatalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  try {
    const raw = await prisma.practice.findMany({
      where: {
        archivedAt: null,
        OR: [{ ownerId: null }, { ownerId: user.id }],
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
      orderBy: [{ isCustom: "asc" }, { name: "asc" }],
    });

    const practices = dedupePracticeCatalog(raw);

    return NextResponse.json({ practices }, { status: 200 });
  } catch (e) {
    console.error("PRACTICES_ERROR:", e);
    return internalError();
  }
}
