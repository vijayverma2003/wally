-- CreateTable
CREATE TABLE `EventSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventSubmissionSetupId` INTEGER NOT NULL,
    `description` VARCHAR(1000) NULL,
    `submissionLink` VARCHAR(1000) NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventSubmission` ADD CONSTRAINT `EventSubmission_eventSubmissionSetupId_fkey` FOREIGN KEY (`eventSubmissionSetupId`) REFERENCES `EventSubmissionSetup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
