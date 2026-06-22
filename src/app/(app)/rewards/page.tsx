import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RewardsView } from "@/app/components/rewards/RewardsView";

export default async function RewardsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <RewardsView coins={user.coins} />;
}
