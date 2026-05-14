import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { normalizeEmail } from "@/lib/auth/email";

export type LoginOk = {
  kind: "ok";
  user: { id: string; email: string; createdAt: Date };
  token: string;
  expiresAt: Date;
};

export type LoginErr = { kind: "invalid_credentials" };

export type LoginResult = LoginOk | LoginErr;

export async function login(params: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  const { email: rawEmail, password } = params;
  const email = normalizeEmail(rawEmail);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true, createdAt: true },
  });

  if (!user) return { kind: "invalid_credentials" };

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { kind: "invalid_credentials" };

  const { token, expiresAt } = await createSession(user.id);

  return {
    kind: "ok",
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    token,
    expiresAt,
  };
}

