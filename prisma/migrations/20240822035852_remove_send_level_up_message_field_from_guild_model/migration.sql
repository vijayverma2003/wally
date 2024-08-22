/*
  Warnings:

  - You are about to drop the column `sendLevelUpMessage` on the `Guild` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guild" (
    "guildId" TEXT NOT NULL PRIMARY KEY,
    "prefix" TEXT NOT NULL DEFAULT '!',
    "levelUpMessage" TEXT,
    "levelRoleMessage" TEXT,
    "levelUpChannelId" TEXT
);
INSERT INTO "new_Guild" ("guildId", "levelRoleMessage", "levelUpChannelId", "levelUpMessage", "prefix") SELECT "guildId", "levelRoleMessage", "levelUpChannelId", "levelUpMessage", "prefix" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
