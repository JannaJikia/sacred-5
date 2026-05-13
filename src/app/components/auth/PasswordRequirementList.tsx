"use client";

import { Check } from "lucide-react";
import { AUTH_STRINGS } from "@/config/strings/auth";
import { cn } from "@/lib/utils";

const HAS_UPPER = /[A-Z]/;
const HAS_DIGIT = /[0-9]/;
const HAS_SYMBOL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

const rows = [
  { key: "len", label: AUTH_STRINGS.requirementLength, test: (p: string) => p.length >= 12 },
  { key: "up", label: AUTH_STRINGS.requirementUpper, test: (p: string) => HAS_UPPER.test(p) },
  { key: "num", label: AUTH_STRINGS.requirementNumber, test: (p: string) => HAS_DIGIT.test(p) },
  { key: "sym", label: AUTH_STRINGS.requirementSymbol, test: (p: string) => HAS_SYMBOL.test(p) },
] as const;

export function PasswordRequirementList({ password }: { password: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5">
      <div className="mb-2 text-xs font-medium text-foreground">{AUTH_STRINGS.passwordHintTitle}</div>
      <ul className="space-y-1.5">
        {rows.map((r) => {
          const ok = r.test(password);
          return (
            <li
              key={r.key}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
              )}
            >
              <Check className={cn("h-3.5 w-3.5 shrink-0", ok ? "opacity-100" : "opacity-25")} />
              {r.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
