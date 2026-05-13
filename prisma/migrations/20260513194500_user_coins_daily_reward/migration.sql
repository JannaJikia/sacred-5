-- AlterTable
ALTER TABLE "User" ADD COLUMN "coins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "DailyRewardClaim" (
    "userId" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "rewardKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyRewardClaim_pkey" PRIMARY KEY ("userId","dayKey","rewardKey")
);

-- AddForeignKey
ALTER TABLE "DailyRewardClaim" ADD CONSTRAINT "DailyRewardClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
