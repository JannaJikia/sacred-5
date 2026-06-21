"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { UI_TEXT } from "@/config/uiText";
import { AUTH_STRINGS } from "@/config/strings/auth";
import { authErrorMessage, validateLoginInput, validateRegisterInput, type AuthMode } from "./authValidation";
import { AuthRegisterFields } from "./AuthRegisterFields";
import { cn } from "@/lib/utils";

export function AuthForm({
  initialMode = "login",
  successRedirectTo = "/",
  modeRoutes = { login: "/login", register: "/register" },
}: {
  initialMode?: AuthMode;
  successRedirectTo?: string;
  modeRoutes?: { login: string; register: string };
}) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<{ email?: boolean; password?: boolean; passwordConfirm?: boolean }>(
    {}
  );
  const [busy, setBusy] = useState(false);

  function resetSecrets() {
    setPassword("");
    setPasswordConfirm("");
    setShowPassword(false);
  }

  async function submit() {
    setError(null);
    setFieldError({});

    if (mode === "login") {
      const err = validateLoginInput({ email, password });
      if (err) return setError(err);
    } else {
      const fe = validateRegisterInput({ email, password, passwordConfirm });
      if (fe) {
        setFieldError({
          email: Boolean(fe.email),
          password: Boolean(fe.password),
          passwordConfirm: Boolean(fe.passwordConfirm),
        });
        const first = fe.email ?? fe.password ?? fe.passwordConfirm;
        if (first) setError(first);
        return;
      }
    }

    const e = email.trim().toLowerCase();
    setBusy(true);
    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const body =
        mode === "login"
          ? { email: e, password }
          : { email: e, password, passwordConfirm };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        setError(authErrorMessage(mode, data));
        return;
      }

      router.push(successRedirectTo);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <section className="space-y-5">
      <div className="flex rounded-xl bg-muted p-1">
        {(["login", "register"] as AuthMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setError(null);
              setFieldError({});
              resetSecrets();
              setMode(m);
              router.push(m === "login" ? modeRoutes.login : modeRoutes.register);
            }}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
              mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "login" ? AUTH_STRINGS.signInTab : AUTH_STRINGS.createAccountTab}
          </button>
        ))}
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        noValidate
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="email">
            {AUTH_STRINGS.emailLabel}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className={cn(
              "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm transition",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
              fieldError.email && "border-destructive focus:ring-destructive"
            )}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={AUTH_STRINGS.emailPlaceholder}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="password">
            {AUTH_STRINGS.passwordLabel}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              className={cn(
                "w-full rounded-xl border bg-background px-3.5 py-2.5 pr-10 text-sm transition",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
                fieldError.password && "border-destructive focus:ring-destructive"
              )}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {!isLogin && (
          <AuthRegisterFields
            password={password}
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            fieldError={fieldError}
          />
        )}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/8 px-3.5 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          className={cn(
            "relative w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all",
            "bg-primary hover:bg-primary/90 active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
          disabled={busy}
        >
          {busy ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {isLogin ? AUTH_STRINGS.signingIn : AUTH_STRINGS.creatingAccount}
            </span>
          ) : isLogin ? (
            UI_TEXT.auth.loginButton
          ) : (
            UI_TEXT.auth.registerButton
          )}
        </button>
      </form>
    </section>
  );
}
