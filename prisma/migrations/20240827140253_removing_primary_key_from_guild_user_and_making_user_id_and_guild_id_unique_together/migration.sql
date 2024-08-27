/*
  Warnings:

  - The primary key for the `GuildUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id,guildId]` on the table `GuildUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `GuildUser` DROP PRIMARY KEY;

-- CreateIndex
CREATE UNIQUE INDEX `GuildUser_id_guildId_key` ON `GuildUser`(`id`, `guildId`);
