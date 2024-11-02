-- CreateTable
CREATE TABLE `QCBotSetup` (
    `guildId` VARCHAR(191) NOT NULL,
    `logChannel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QCBotSetup` ADD CONSTRAINT `QCBotSetup_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;
