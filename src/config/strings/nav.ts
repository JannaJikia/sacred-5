import { LayoutDashboard, BarChart2, ListChecks } from "lucide-react";

export const NAV_STRINGS = {
  dashboard: "Dashboard",
  stats: "Stats",
  practices: "Practices",
  leaderboard: "Leaderboard",
  logout: "Logout",
  coins: "Coins",
  account: "Account",
} as const;

// Leaderboard is intentionally unlisted until it ships (future accountability
// feature); the /leaderboard route still exists but is not a dead-end nav tab.
export const APP_NAV_LINKS = [
  { href: "/", label: NAV_STRINGS.dashboard, icon: LayoutDashboard },
  { href: "/stats", label: NAV_STRINGS.stats, icon: BarChart2 },
  { href: "/practices", label: NAV_STRINGS.practices, icon: ListChecks },
] as const;
