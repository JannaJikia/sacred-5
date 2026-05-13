import { Trophy, Clock } from "lucide-react";
import { LEADERBOARD_STRINGS } from "@/config/strings/leaderboard";
import { formatPointsShort } from "@/lib/formatPoints";

const mockPlayers = [
  { rank: 1, name: "You", points: 142, streak: 12, avatar: "Y" },
  { rank: 2, name: "sadhana_k", points: 138, streak: 9, avatar: "S" },
  { rank: 3, name: "inner_fire", points: 121, streak: 8, avatar: "I" },
] as const;

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-violet-500/10 p-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{LEADERBOARD_STRINGS.comingSoonTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{LEADERBOARD_STRINGS.comingSoonBody}</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[2px]">
          <div className="text-center">
            <Trophy className="mx-auto h-8 w-8 text-primary/60" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">{LEADERBOARD_STRINGS.previewOverlay}</p>
          </div>
        </div>

        <h3 className="mb-4 text-sm font-semibold text-foreground">{LEADERBOARD_STRINGS.previewTitle}</h3>
        <div className="space-y-3">
          {mockPlayers.map((p) => (
            <div key={p.rank} className="flex select-none items-center gap-3">
              <div className="w-5 text-center text-sm font-bold text-muted-foreground">{p.rank}</div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {p.avatar}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{LEADERBOARD_STRINGS.streakLine(p.streak)}</div>
              </div>
              <div className="text-sm font-bold text-foreground">{formatPointsShort(p.points)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
