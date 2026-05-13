import { PAGE_STRINGS } from "@/config/strings/pages";

export function shellPageMeta(pathname: string): { title: string; subtitle: string | null } {
  if (pathname === "/") {
    return { title: PAGE_STRINGS.dashboardTitle, subtitle: PAGE_STRINGS.dashboardSubtitle };
  }
  if (pathname.startsWith("/stats")) {
    return { title: PAGE_STRINGS.statsTitle, subtitle: PAGE_STRINGS.statsSubtitle };
  }
  if (pathname.startsWith("/practices")) {
    return { title: PAGE_STRINGS.practicesTitle, subtitle: PAGE_STRINGS.practicesSubtitle };
  }
  if (pathname.startsWith("/leaderboard")) {
    return { title: PAGE_STRINGS.leaderboardTitle, subtitle: PAGE_STRINGS.leaderboardSubtitle };
  }
  return { title: PAGE_STRINGS.appFallbackTitle, subtitle: null };
}
