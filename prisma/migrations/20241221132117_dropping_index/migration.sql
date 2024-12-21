-- This is an empty migration.
ALTER TABLE LiveLeaderboardPrizes DROP FOREIGN KEY LiveLeaderboardPrizes_guildId_fkey;
ALTER TABLE LiveLeaderboardPrizes DROP INDEX LiveLeaderboardPrizes_guildId_key;
ALTER TABLE LiveLeaderboardPrizes
ADD CONSTRAINT LiveLeaderboardPrizes_guildId_fkey
FOREIGN KEY (guildId) REFERENCES Guild(guildId) ON DELETE RESTRICT ON UPDATE CASCADE;

