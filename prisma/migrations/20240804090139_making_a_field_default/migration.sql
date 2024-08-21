-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guild" (
    "guildId" TEXT NOT NULL PRIMARY KEY,
    "prefix" TEXT NOT NULL DEFAULT '!',
    "sendLevelUpMessage" BOOLEAN NOT NULL DEFAULT false,
    "levelUpMessage" TEXT,
    "levelRoleMessage" TEXT,
    "levelUpChannelId" TEXT
);
INSERT INTO "new_Guild" ("guildId", "levelRoleMessage", "levelUpChannelId", "levelUpMessage", "prefix", "sendLevelUpMessage") SELECT "guildId", "levelRoleMessage", "levelUpChannelId", "levelUpMessage", "prefix", "sendLevelUpMessage" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
