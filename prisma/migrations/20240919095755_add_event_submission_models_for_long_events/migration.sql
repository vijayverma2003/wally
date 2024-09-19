-- CreateTable
CREATE TABLE `EventSubmissionEmbed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `description` VARCHAR(2000) NOT NULL,
    `submissionChannelId` VARCHAR(50) NOT NULL,
    `eventEndTimestamp` VARCHAR(50) NOT NULL,
    `embedColor` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(1000) NOT NULL,
    `submissionLink` VARCHAR(1000) NOT NULL,
    `eventId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventSubmission` ADD CONSTRAINT `EventSubmission_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `EventSubmissionEmbed`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
