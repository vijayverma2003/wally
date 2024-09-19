/*
  Warnings:

  - You are about to drop the column `channelId` on the `EventSubmissionSetup` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `EventSubmissionSetup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `EventSubmissionSetup` DROP COLUMN `channelId`,
    DROP COLUMN `messageId`;
