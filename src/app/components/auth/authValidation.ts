import { UI_TEXT } from "@/config/uiText";
import { parseRegisterPassword, passwordConfirmMessage } from "@/lib/auth/passwordPolicy";
import { zodNormalizedEmail } from "@/lib/auth/zodEmail";

export type AuthMode = "login" | "register";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function validateLoginInput(params: { email: string; password: string }): string | null {
  const e = zodNormalizedEmail.safeParse(params.email);
  if (!e.success) {
    const msg = e.error.issues[0]?.message;
    return msg ?? UI_TEXT.auth.invalidEmail;
  }
  if (!params.password) return UI_TEXT.auth.passwordRequired;
  return null;
}

export type RegisterFieldErrors = Partial<{
  email: string;
  password: string;
  passwordConfirm: string;
}>;

export function validateRegisterInput(params: {
  email: string;
  password: string;
  passwordConfirm: string;
}): RegisterFieldErrors | null {
  const errors: RegisterFieldErrors = {};
  const e = zodNormalizedEmail.safeParse(params.email);
  if (!e.success) {
    const msg = e.error.issues[0]?.message;
    errors.email = msg ?? UI_TEXT.auth.invalidEmail;
  }

  const pw = parseRegisterPassword(params.password);
  if (!pw.ok) errors.password = pw.message;

  const confirm = passwordConfirmMessage(params.password, params.passwordConfirm);
  if (confirm) errors.passwordConfirm = confirm;

  return Object.keys(errors).length ? errors : null;
}

export function authErrorMessage(mode: AuthMode, data: unknown): string {
  if (isRecord(data) && isRecord(data.error)) {
    const err = data.error as Record<string, unknown>;
    const code = typeof err.code === "string" ? err.code : undefined;
    const message = typeof err.message === "string" ? err.message : undefined;

    switch (code) {
      case "INVALID_CREDENTIALS":
        return UI_TEXT.auth.invalidCredentials;
      case "EMAIL_TAKEN":
        return UI_TEXT.auth.emailTaken;
      case "VALIDATION_ERROR":
        return message ?? UI_TEXT.auth.invalidInput;
      default:
        return message ?? `${mode} failed`;
    }
  }

  if (isRecord(data)) {
    const legacyError = data.error;
    if (typeof legacyError === "string") return legacyError;
  }

  return `${mode} failed`;
}
