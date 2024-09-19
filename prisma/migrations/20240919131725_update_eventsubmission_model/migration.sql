/*
  Warnings:

  - Added the required column `channelId` to the `EventSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `EventSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EventSubmission` ADD COLUMN `channelId` VARCHAR(191) NOT NULL,
    ADD COLUMN `messageId` VARCHAR(191) NOT NULL;
