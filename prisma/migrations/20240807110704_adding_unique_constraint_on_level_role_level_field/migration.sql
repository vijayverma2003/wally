/*
  Warnings:

  - A unique constraint covering the columns `[level]` on the table `LevelRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LevelRole_level_key" ON "LevelRole"("level");
