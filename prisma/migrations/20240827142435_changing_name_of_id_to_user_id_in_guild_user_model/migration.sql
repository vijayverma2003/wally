/*
  Warnings:

  - The primary key for the `GuildUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GuildUser` table. All the data in the column will be lost.
  - Added the required column `userId` to the `GuildUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GuildUser`
    ADD COLUMN `userId` VARCHAR(191);

UPDATE `GuildUser`
    SET GuildUser.userId = GuildUser.id;

ALTER TABLE `GuildUser`
    DROP PRIMARY KEY,
    MODIFY COLUMN `userId` VARCHAR(191) NOT NULL,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`, `guildId`);
