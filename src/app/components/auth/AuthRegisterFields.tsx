"use client";

import { Eye, EyeOff } from "lucide-react";
import { AUTH_STRINGS } from "@/config/strings/auth";
import { cn } from "@/lib/utils";
import { PasswordRequirementList } from "./PasswordRequirementList";

type FieldErr = { username?: boolean; password?: boolean; passwordConfirm?: boolean };

export function AuthRegisterFields({
  password,
  passwordConfirm,
  setPasswordConfirm,
  showPassword,
  setShowPassword,
  fieldError,
}: {
  password: string;
  passwordConfirm: string;
  setPasswordConfirm: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean | ((b: boolean) => boolean)) => void;
  fieldError: FieldErr;
}) {
  return (
    <>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="passwordConfirm">
          {AUTH_STRINGS.confirmPasswordLabel}
        </label>
        <div className="relative">
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            autoComplete="new-password"
            className={cn(
              "w-full rounded-xl border bg-background px-3.5 py-2.5 pr-10 text-sm transition",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
              fieldError.passwordConfirm && "border-destructive focus:ring-destructive"
            )}
            type={showPassword ? "text" : "password"}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder={AUTH_STRINGS.passwordPlaceholder}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            onClick={() => setShowPassword((v) => !v)}
            aria-pressed={showPassword}
            aria-label={showPassword ? AUTH_STRINGS.hidePasswordAria : AUTH_STRINGS.showPasswordAria}
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>
      <PasswordRequirementList password={password} />
    </>
  );
}
