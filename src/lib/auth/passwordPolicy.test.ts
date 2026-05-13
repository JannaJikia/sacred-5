import { describe, it, expect } from "vitest";
import { AUTH_STRINGS } from "@/config/strings/auth";
import { parseRegisterPassword, passwordConfirmMessage, registerPasswordSchema } from "@/lib/auth/passwordPolicy";

describe("passwordPolicy", () => {
  it("accepts a strong password", () => {
    expect(parseRegisterPassword("GoodPass123!").ok).toBe(true);
    expect(registerPasswordSchema.safeParse("GoodPass123!").success).toBe(true);
  });

  it("rejects short passwords", () => {
    const r = parseRegisterPassword("Short1!");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toBe(AUTH_STRINGS.passwordErrors.minLength);
  });

  it("rejects missing uppercase", () => {
    const r = parseRegisterPassword("lowercase123!");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toBe(AUTH_STRINGS.passwordErrors.upper);
  });

  it("rejects missing digit", () => {
    const r = parseRegisterPassword("NoDigitHere!!");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toBe(AUTH_STRINGS.passwordErrors.digit);
  });

  it("rejects missing symbol", () => {
    const r = parseRegisterPassword("NoSymbol12345");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toBe(AUTH_STRINGS.passwordErrors.symbol);
  });

  it("passwordConfirmMessage catches mismatch", () => {
    expect(passwordConfirmMessage("GoodPass123!", "")).toBe(AUTH_STRINGS.confirmPasswordRequired);
    expect(passwordConfirmMessage("GoodPass123!", "x")).toBe(AUTH_STRINGS.passwordMismatch);
    expect(passwordConfirmMessage("GoodPass123!", "GoodPass123!")).toBeNull();
  });
});
