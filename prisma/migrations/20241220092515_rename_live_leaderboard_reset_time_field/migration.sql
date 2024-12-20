/*
  Warnings:

  - You are about to drop the column `liveLeaderboardResetTime` on the `Guild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Guild` DROP COLUMN `liveLeaderboardResetTime`,
    ADD COLUMN `liveLeaderboardResetPeriod` ENUM('weekly', 'daily', 'monthly') NULL;
