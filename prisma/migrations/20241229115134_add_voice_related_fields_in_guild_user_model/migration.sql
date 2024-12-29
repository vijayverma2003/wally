-- AlterTable
ALTER TABLE `GuildUser` ADD COLUMN `vcLastJoinedAt` DATETIME(3) NULL,
    ADD COLUMN `vcTimeSpent` INTEGER NULL;
