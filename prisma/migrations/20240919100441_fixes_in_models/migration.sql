/*
  Warnings:

  - Added the required column `channelId` to the `EventSubmissionEmbed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `EventSubmissionEmbed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EventSubmission` MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `EventSubmissionEmbed` ADD COLUMN `channelId` VARCHAR(50) NOT NULL,
    ADD COLUMN `messageId` VARCHAR(50) NOT NULL,
    MODIFY `description` VARCHAR(2000) NULL,
    MODIFY `eventEndTimestamp` VARCHAR(50) NULL,
    MODIFY `embedColor` VARCHAR(10) NULL;
