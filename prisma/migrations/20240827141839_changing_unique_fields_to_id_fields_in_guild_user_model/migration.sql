-- DropIndex
DROP INDEX `GuildUser_id_guildId_key` ON `GuildUser`;

-- AlterTable
ALTER TABLE `GuildUser` ADD PRIMARY KEY (`id`, `guildId`);
