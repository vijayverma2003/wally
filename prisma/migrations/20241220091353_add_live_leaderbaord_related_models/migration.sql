-- AlterTable
ALTER TABLE `Guild` ADD COLUMN `liveLeaderboardChannelId` VARCHAR(191) NULL,
    ADD COLUMN `liveLeaderboardMessageId` VARCHAR(191) NULL,
    ADD COLUMN `liveLeaderboardResetTime` ENUM('weekly', 'daily', 'monthly') NULL;

-- AlterTable
ALTER TABLE `GuildUser` ADD COLUMN `liveLeaderboardMessageCount` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Channel` (
    `channelId` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `liveLeaderboard` BOOLEAN NOT NULL,

    PRIMARY KEY (`channelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Channel` ADD CONSTRAINT `Channel_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;
