/*
  Warnings:

  - A unique constraint covering the columns `[guildId]` on the table `LiveLeaderboardPrizes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guildId` to the `LiveLeaderboardPrizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LiveLeaderboardPrizes` ADD COLUMN `guildId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LiveLeaderboardPrizes_guildId_key` ON `LiveLeaderboardPrizes`(`guildId`);

-- AddForeignKey
ALTER TABLE `LiveLeaderboardPrizes` ADD CONSTRAINT `LiveLeaderboardPrizes_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;
