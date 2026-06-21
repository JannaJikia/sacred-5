import { Coins, Palette, Snowflake } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  DAILY_COMPLETION_GOAL,
  MILESTONE_REWARD_COINS,
  STREAK_FREEZE_COST,
  THEME_PACK_COST,
} from "@/config/rewards";
import { REWARDS_STRINGS } from "@/config/strings/rewards";

function RewardCard({
  icon: Icon,
  title,
  desc,
  cost,
  have,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  cost: number;
  have: number;
}) {
  const pct = Math.min(100, Math.round((have / cost) * 100));
  return (
    <div className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {REWARDS_STRINGS.soonBadge}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-primary">{REWARDS_STRINGS.cost(cost)}</span>
        <span className="text-xs tabular-nums text-muted-foreground">{REWARDS_STRINGS.saved(have, cost)}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} aria-hidden />
      </div>
    </div>
  );
}

export function RewardsView({ coins }: { coins: number }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Coins className="h-7 w-7" />
          </span>
          <div>
            <div className="text-sm text-muted-foreground">{REWARDS_STRINGS.balanceLabel}</div>
            <div className="font-display text-4xl font-bold tabular-nums text-foreground">{coins}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">{REWARDS_STRINGS.earnTitle}</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            {REWARDS_STRINGS.earnDailyGoal(MILESTONE_REWARD_COINS, DAILY_COMPLETION_GOAL)}
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            {REWARDS_STRINGS.earnConsistency}
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{REWARDS_STRINGS.spendTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{REWARDS_STRINGS.spendIntro}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <RewardCard
            icon={Snowflake}
            title={REWARDS_STRINGS.freezeTitle}
            desc={REWARDS_STRINGS.freezeDesc}
            cost={STREAK_FREEZE_COST}
            have={coins}
          />
          <RewardCard
            icon={Palette}
            title={REWARDS_STRINGS.themesTitle}
            desc={REWARDS_STRINGS.themesDesc}
            cost={THEME_PACK_COST}
            have={coins}
          />
        </div>
      </div>
    </div>
  );
}
