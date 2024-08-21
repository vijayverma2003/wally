-- CreateTable
CREATE TABLE "Guild" (
    "guildId" TEXT NOT NULL PRIMARY KEY,
    "prefix" TEXT NOT NULL DEFAULT '!',
    "sendLevelUpMessage" BOOLEAN NOT NULL,
    "levelUpMessage" TEXT,
    "levelRoleMessage" TEXT,
    "levelUpChannelId" TEXT
);

-- CreateTable
CREATE TABLE "GuildUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "guildId" TEXT NOT NULL,
    CONSTRAINT "GuildUser_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("guildId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LevelRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guildId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    CONSTRAINT "LevelRole_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("guildId") ON DELETE RESTRICT ON UPDATE CASCADE
);
