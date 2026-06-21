import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PracticesList } from "@components/tracker/PracticesList";
import { StreakBadge } from "@components/tracker/StreakBadge";
import { PAGE_STRINGS } from "@/config/strings/pages";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StreakBadge />
      <PracticesList />
      <Link
        href="/stats"
        className="flex items-center justify-between rounded-2xl border bg-card px-5 py-4 shadow-sm transition hover:bg-muted/50"
      >
        <span className="text-sm font-medium text-foreground">{PAGE_STRINGS.dashboardStatsLink}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
      </Link>
    </div>
  );
}
