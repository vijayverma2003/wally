/*
  Warnings:

  - You are about to drop the `QCBotSetup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `QCBotSetup` DROP FOREIGN KEY `QCBotSetup_guildId_fkey`;

-- DropTable
DROP TABLE `QCBotSetup`;

-- CreateTable
CREATE TABLE `ModelMakerSetup` (
    `guildId` VARCHAR(191) NOT NULL,
    `logChannel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ModelMakerSetup` ADD CONSTRAINT `ModelMakerSetup_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;
