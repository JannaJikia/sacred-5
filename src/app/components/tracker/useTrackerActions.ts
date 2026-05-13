"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postDone, postUndo, type DoneResponse } from "@/lib/http/api";
import { UI_TEXT } from "@/config/uiText";

function emitPracticeUpdated() {
  window.dispatchEvent(new Event("practice-updated"));
}

function emitCoinsUpdated(coins: number) {
  window.dispatchEvent(new CustomEvent("coins-updated", { detail: { coins } }));
}

export function useTrackerActions(reload: () => Promise<void>) {
  const router = useRouter();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function onDone(practiceId: string): Promise<DoneResponse | null> {
    try {
      setBusyKey(practiceId);
      setActionError(null);
      const data = await postDone(practiceId);
      try {
        await reload();
      } catch {
        /* Balance from postDone is still valid; list may be stale until next refresh. */
      }
      emitCoinsUpdated(data.reward.coinsBalance);
      emitPracticeUpdated();
      return data;
    } catch (e: unknown) {
      const err = e as import("@/lib/http/client").HttpError;

      if (err?.code === "MAX_PER_DAY_REACHED") {
        setActionError(UI_TEXT.errors.maxReached);
      } else if (err?.status === 401) {
        setActionError(UI_TEXT.auth.pleaseLogin);
        router.replace("/login");
      } else {
        setActionError(err?.message ?? UI_TEXT.errors.doneFailed);
      }
      return null;
    } finally {
      setBusyKey(null);
    }
  }

  async function onUndo(practiceId: string) {
    try {
      setBusyKey(practiceId);
      setActionError(null);
      await postUndo(practiceId);
      await reload();
      emitPracticeUpdated();
    } catch (e: unknown) {
      const err = e as import("@/lib/http/client").HttpError;
      if (err?.status === 401) {
        setActionError(UI_TEXT.auth.pleaseLogin);
        router.replace("/login");
      } else {
        setActionError(err?.message ?? UI_TEXT.errors.undoFailed);
      }
    } finally {
      setBusyKey(null);
    }
  }

  return { busyKey, actionError, onDone, onUndo };
}
