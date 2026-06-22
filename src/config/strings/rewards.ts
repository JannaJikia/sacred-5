export const REWARDS_STRINGS = {
  balanceLabel: "Your coins",
  earnTitle: "How you earn",
  earnDailyGoal: (reward: number, goal: number) =>
    `Hit your daily goal of ${goal} completions to earn +${reward} coins.`,
  earnConsistency: "Coins stack the more consistently you show up, and they are yours to keep.",
  spendTitle: "What coins unlock",
  spendIntro: "Save toward these. Redemption is on the way.",
  soonBadge: "Soon",
  freezeTitle: "Streak freeze",
  freezeDesc: "Protect your streak on a day you miss, no questions asked.",
  themesTitle: "Accent themes",
  themesDesc: "Personalize the app with unlockable color accents.",
  cost: (n: number) => `${n} coins`,
  saved: (have: number, cost: number) => `${Math.min(have, cost)} / ${cost} saved`,
} as const;
