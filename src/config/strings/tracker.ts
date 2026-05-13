export const TRACKER_STRINGS = {
  todayPrefix: "Today",
  completedSummary: (done: number, max: number) => `${done} / ${max} completed`,
  retry: "Retry",
  goToLogin: "Go to login",
  completedForToday: "Completed for today",
  moreAvailable: (n: number) => `${n} more available today`,
  notStarted: "Not started today",
  undo: "Undo",
  markDone: "Mark done",
  done: "Done",
  busyEllipsis: "…",
} as const;

export const CELEBRATION_STRINGS = {
  title: "Daily goal crushed!",
  subtitle: (n: number) => `You logged ${n} completions today.`,
  coinsLine: (n: number) => `+${n} coins`,
  dismiss: "Nice!",
  balanceLine: (total: number) => `Balance: ${total} coins`,
  badgeFirstMilestone: "1st milestone",
} as const;
