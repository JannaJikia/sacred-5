import { LayoutDashboard, BarChart2, Trophy, ListChecks } from "lucide-react";

export const NAV_STRINGS = {
  dashboard: "Dashboard",
  stats: "Stats",
  practices: "Practices",
  leaderboard: "Leaderboard",
  logout: "Logout",
  coins: "Coins",
  account: "Account",
} as const;

export const APP_NAV_LINKS = [
  { href: "/", label: NAV_STRINGS.dashboard, icon: LayoutDashboard },
  { href: "/stats", label: NAV_STRINGS.stats, icon: BarChart2 },
  { href: "/practices", label: NAV_STRINGS.practices, icon: ListChecks },
  { href: "/leaderboard", label: NAV_STRINGS.leaderboard, icon: Trophy },
] as const;
