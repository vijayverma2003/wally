/*
  Warnings:

  - A unique constraint covering the columns `[guildId,level]` on the table `LevelRole` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LevelRole_level_key";

-- CreateIndex
CREATE UNIQUE INDEX "LevelRole_guildId_level_key" ON "LevelRole"("guildId", "level");
