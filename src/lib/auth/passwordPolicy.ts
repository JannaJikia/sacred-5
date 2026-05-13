import { z } from "zod";

import { AUTH_STRINGS } from "@/config/strings/auth";

const HAS_SYMBOL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

const pe = AUTH_STRINGS.passwordErrors;

export const registerPasswordSchema = z
  .string()
  .min(12, pe.minLength)
  .regex(/[A-Z]/, pe.upper)
  .regex(/[0-9]/, pe.digit)
  .regex(HAS_SYMBOL, pe.symbol);

export function parseRegisterPassword(password: string): { ok: true } | { ok: false; message: string } {
  const r = registerPasswordSchema.safeParse(password);
  if (r.success) return { ok: true };
  const first = r.error.issues[0];
  return { ok: false, message: first?.message ?? pe.minLength };
}

export function passwordConfirmMessage(password: string, passwordConfirm: string): string | null {
  if (passwordConfirm.length === 0) return AUTH_STRINGS.confirmPasswordRequired;
  if (password !== passwordConfirm) return AUTH_STRINGS.passwordMismatch;
  return null;
}
