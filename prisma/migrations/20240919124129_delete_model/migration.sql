/*
  Warnings:

  - You are about to drop the `EventSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `EventSubmission` DROP FOREIGN KEY `EventSubmission_eventId_fkey`;

-- DropTable
DROP TABLE `EventSubmission`;
