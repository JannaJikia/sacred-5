// prisma/seed.ts
import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/db";
import { PRACTICES } from "../src/config/practices";

async function main() {
  // After username→email migration, old demo rows may still be `demo1` etc. Remove so upsert uses real emails.
  await prisma.user.deleteMany({
    where: { email: { in: ["demo1", "demo2", "demo3"] } },
  });

  const users = [
    { email: "demo1@example.com", password: "SacredDemo12!" },
    { email: "demo2@example.com", password: "SacredDemo12!" },
    { email: "demo3@example.com", password: "SacredDemo12!" },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);

    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash },
      create: { email: u.email, passwordHash },
    });
  }

  for (const p of PRACTICES) {
    await prisma.practice.upsert({
      where: { id: p.key },
      update: {
        name: p.label,
        points: p.points,
        maxPerDay: p.maxPerDay,
        isCustom: false,
      },
      create: {
        id: p.key,
        name: p.label,
        points: p.points,
        maxPerDay: p.maxPerDay,
        isCustom: false,
      },
    });
  }

  console.log("✅ Seeded demo users + practices");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
