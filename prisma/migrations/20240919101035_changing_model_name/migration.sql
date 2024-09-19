/*
  Warnings:

  - You are about to drop the `EventSubmissionEmbed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `EventSubmission` DROP FOREIGN KEY `EventSubmission_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `EventSubmissionEmbed` DROP FOREIGN KEY `EventSubmissionEmbed_guildId_fkey`;

-- DropTable
DROP TABLE `EventSubmissionEmbed`;

-- CreateTable
CREATE TABLE `EventSubmissionSetup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `description` VARCHAR(2000) NULL,
    `submissionChannelId` VARCHAR(50) NOT NULL,
    `eventEndTimestamp` VARCHAR(50) NULL,
    `embedColor` VARCHAR(10) NULL,
    `messageId` VARCHAR(50) NOT NULL,
    `channelId` VARCHAR(50) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventSubmissionSetup` ADD CONSTRAINT `EventSubmissionSetup_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSubmission` ADD CONSTRAINT `EventSubmission_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `EventSubmissionSetup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
