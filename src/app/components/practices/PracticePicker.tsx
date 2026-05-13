"use client";

import { usePracticePicker, type PracticePickerMode } from "./usePracticePicker";
import { PracticeFlashGrid } from "./PracticeFlashGrid";
import { CustomPracticeInput } from "./CustomPracticeInput";
import { ErrorBanner } from "./ErrorBanner";
import { PracticePickerActions } from "./PracticePickerActions";
import { PRACTICES_STRINGS } from "@/config/strings/practices";

export function PracticePicker({ mode }: { mode: PracticePickerMode }) {
  const vm = usePracticePicker({ mode });

  const canSave =
    !vm.busy &&
    vm.selectedCount > 0 &&
    vm.selectedCount <= 10;

  return (
    <section className="space-y-6">
      {mode === "onboarding" ? (
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{PRACTICES_STRINGS.onboardingTitle}</h1>
          <p className="text-sm text-muted-foreground">{PRACTICES_STRINGS.manageIntro}</p>
        </header>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">{PRACTICES_STRINGS.manageIntro}</p>
      )}

      <div className="space-y-3">
        <div className="text-sm font-medium text-foreground">{PRACTICES_STRINGS.tapToSelect}</div>

        {vm.practices === null ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
            {PRACTICES_STRINGS.loading}
          </div>
        ) : (
          <PracticeFlashGrid items={vm.items} selectedIds={vm.selectedIds} onToggle={vm.togglePractice} />
        )}
      </div>

      <CustomPracticeInput
        disabled={vm.practices === null}
        busy={vm.customBusy}
        selectedCount={vm.selectedCount}
        onAdd={vm.addCustomPractice}
      />

      <ErrorBanner message={vm.error} />

      <PracticePickerActions
        mode={mode}
        busy={vm.busy}
        selectedCount={vm.selectedCount}
        canSave={canSave}
        onSave={vm.saveSelection}
      />
    </section>
  );
}
