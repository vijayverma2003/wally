-- CreateTable
CREATE TABLE `ChannelActivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(191) NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `messageCount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffActivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `messageCount` INTEGER NOT NULL,
    `bans` INTEGER NOT NULL DEFAULT 0,
    `kicks` INTEGER NOT NULL DEFAULT 0,
    `mutes` INTEGER NOT NULL DEFAULT 0,
    `activity` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
