import { prisma } from "@/lib/db";
import { createSession, hashPassword, isUniqueConstraintError } from "@/lib/auth";
import { parseRegisterPassword } from "@/lib/auth/passwordPolicy";

export type RegisterOk = {
  kind: "ok";
  user: { id: string; username: string; createdAt: Date };
  token: string;
  expiresAt: Date;
};

export type RegisterErr = { kind: "username_taken" };

export type RegisterInvalidPassword = { kind: "invalid_password"; message: string };

export type RegisterResult = RegisterOk | RegisterErr | RegisterInvalidPassword;

export async function register(params: {
  username: string;
  password: string;
}): Promise<RegisterResult> {
  const { username, password } = params;

  const policy = parseRegisterPassword(password);
  if (!policy.ok) return { kind: "invalid_password", message: policy.message };

  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: { username, passwordHash },
      select: { id: true, username: true, createdAt: true },
    });

    const { token, expiresAt } = await createSession(user.id);

    return { kind: "ok", user, token, expiresAt };
  } catch (e) {
    if (isUniqueConstraintError(e)) return { kind: "username_taken" };
    throw e;
  }
}
