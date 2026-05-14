import { prisma } from "@/lib/db";
import { createSession, hashPassword, isUniqueConstraintError } from "@/lib/auth";
import { normalizeEmail } from "@/lib/auth/email";
import { parseRegisterPassword } from "@/lib/auth/passwordPolicy";

export type RegisterOk = {
  kind: "ok";
  user: { id: string; email: string; createdAt: Date };
  token: string;
  expiresAt: Date;
};

export type RegisterErr = { kind: "email_taken" };

export type RegisterInvalidPassword = { kind: "invalid_password"; message: string };

export type RegisterResult = RegisterOk | RegisterErr | RegisterInvalidPassword;

export async function register(params: {
  email: string;
  password: string;
}): Promise<RegisterResult> {
  const email = normalizeEmail(params.email);
  const { password } = params;

  const policy = parseRegisterPassword(password);
  if (!policy.ok) return { kind: "invalid_password", message: policy.message };

  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true },
    });

    const { token, expiresAt } = await createSession(user.id);

    return { kind: "ok", user, token, expiresAt };
  } catch (e) {
    if (isUniqueConstraintError(e)) return { kind: "email_taken" };
    throw e;
  }
}
