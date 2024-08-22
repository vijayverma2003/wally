/*
  Warnings:

  - You are about to drop the column `prefix` on the `Guild` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guild" (
    "guildId" TEXT NOT NULL PRIMARY KEY,
    "levelUpMessage" TEXT,
    "levelRoleMessage" TEXT,
    "levelUpChannelId" TEXT
);
INSERT INTO "new_Guild" ("guildId", "levelRoleMessage", "levelUpChannelId", "levelUpMessage") SELECT "guildId", "levelRoleMessage", "levelUpChannelId", "levelUpMessage" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
