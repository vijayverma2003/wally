/*
  Warnings:

  - A unique constraint covering the columns `[position]` on the table `LiveLeaderboardPrizes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LiveLeaderboardPrizes_position_key` ON `LiveLeaderboardPrizes`(`position`);
