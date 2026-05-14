import { NextResponse } from "next/server";
import { z } from "zod";

import { setSessionCookie } from "@/lib/cookies";
import { validationError, internalError, emailTaken } from "@/lib/http/errors";
import { register } from "@/server/auth/register";
import { registerPasswordSchema } from "@/lib/auth/passwordPolicy";
import { zodNormalizedEmail } from "@/lib/auth/zodEmail";
import { AUTH_STRINGS } from "@/config/strings/auth";

export const dynamic = "force-dynamic";

const RegisterSchema = z
  .object({
    email: zodNormalizedEmail,
    password: z.string().max(128),
    passwordConfirm: z.string().max(128),
  })
  .superRefine((val, ctx) => {
    const pw = registerPasswordSchema.safeParse(val.password);
    if (!pw.success) {
      for (const issue of pw.error.issues) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: issue.message, path: ["password"] });
      }
      return;
    }
    if (val.password !== val.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: AUTH_STRINGS.passwordMismatch,
        path: ["passwordConfirm"],
      });
    }
  });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(z.treeifyError(parsed.error), "Invalid input");
  }

  const { email, password } = parsed.data;

  try {
    const result = await register({ email, password });

    if (result.kind === "invalid_password") {
      return validationError({ password: [result.message] }, "Invalid input");
    }

    if (result.kind === "email_taken") return emailTaken(email);

    await setSessionCookie(result.token, result.expiresAt);
    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch (e) {
    console.error("REGISTER_ERROR:", e);
    return internalError();
  }
}
