/*
  Warnings:

  - Added the required column `guildId` to the `EventSubmissionEmbed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EventSubmissionEmbed` ADD COLUMN `guildId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `EventSubmissionEmbed` ADD CONSTRAINT `EventSubmissionEmbed_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;
