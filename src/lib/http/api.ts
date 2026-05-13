import { fetchJson } from "@/lib/http/client";

export type PracticeDto = {
  id: string;
  name: string;
  description: string | null;
  iconKey: string | null;
  isCustom: boolean;
  points: number;
  maxPerDay: number;
};

export type CompletionsResponse = {
  dayKey: string;
  completions: Array<{
    practiceId: string;
    count: number;
    lastCompletedAt: string | null;
    updatedAt: string;
  }>;
  byPracticeId: Record<
    string,
    { practiceId: string; count: number; lastCompletedAt: string | null; updatedAt: string }
  >;
};

export function getPractices() {
  return fetchJson<{ practices: PracticeDto[] }>("/api/practices", { cache: "no-store" });
}

export function getTodayCompletions() {
  return fetchJson<CompletionsResponse>("/api/completions", { cache: "no-store" });
}

export type DoneCompletionDto = {
  id: string;
  userId: string;
  practiceId: string;
  dayKey: string;
  count: number;
  lastCompletedAt: string | null;
  updatedAt: string;
};

export type DoneResponse = {
  completion: DoneCompletionDto;
  dayKey: string;
  practiceId: string;
  maxPerDay: number;
  reward: {
    milestoneHit: boolean;
    coinsEarned: number;
    totalToday: number;
    coinsBalance: number;
    celebrationBadge: string | null;
  };
};

export function postDone(practiceId: string) {
  return fetchJson<DoneResponse>("/api/done", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ practiceId }),
  });
}

export function postUndo(practiceId: string) {
  return fetchJson("/api/undo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ practiceId }),
  });
}

export type OnboardingResponse = {
  practiceIds: string[];
};

export function getOnboarding() {
  return fetchJson<OnboardingResponse>("/api/onboarding", { cache: "no-store" });
}

export function createCustomPractice(params: {
  name: string;
  points?: number;
  maxPerDay?: number;
  description?: string;
  iconKey?: string;
}) {
  return fetchJson<{ practice: PracticeDto }>("/api/practices/custom", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}
