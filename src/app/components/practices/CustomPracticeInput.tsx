"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { MAX_SELECTED } from "./usePracticePicker";
import { PRACTICES_STRINGS } from "@/config/strings/practices";
import { cn } from "@/lib/utils";

export function CustomPracticeInput({
  disabled,
  busy,
  selectedCount,
  onAdd,
}: {
  disabled: boolean;
  busy: boolean;
  selectedCount: number;
  onAdd: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const atLimit = selectedCount >= MAX_SELECTED;
  const canAdd = !disabled && !busy && !atLimit && name.trim().length > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-5 shadow-sm">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{PRACTICES_STRINGS.addCustomTitle}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {PRACTICES_STRINGS.addCustomDescription}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              className={cn(
                "min-h-10 w-full flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm",
                "placeholder:text-muted-foreground",
                "focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
              )}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={PRACTICES_STRINGS.namePlaceholder}
              disabled={disabled || atLimit}
            />
            <button
              type="button"
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                "bg-primary text-primary-foreground shadow-sm hover:opacity-95 active:scale-[0.98]",
                "disabled:cursor-not-allowed disabled:opacity-45"
              )}
              disabled={!canAdd}
              onClick={async () => {
                await onAdd(name);
                setName("");
              }}
            >
              {busy ? PRACTICES_STRINGS.adding : PRACTICES_STRINGS.addButton}
            </button>
          </div>
          {atLimit && <p className="text-xs text-amber-600 dark:text-amber-400">{PRACTICES_STRINGS.atLimitHint}</p>}
        </div>
      </div>
    </div>
  );
}
