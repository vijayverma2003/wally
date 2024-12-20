import { Client, EmbedBuilder } from "discord.js";
import { prisma } from "../prisma/client";
import { GuildUser, LiveLeaderboardPrizes } from "@prisma/client";

export const scanAndCreateGuilds = async (client: Client) => {
  const guilds = await client.guilds.fetch();

  guilds.forEach(async (guild) => {
    try {
      const guildInDb = await prisma.guild.findUnique({
        where: { guildId: guild.id },
      });

      if (!guildInDb)
        await prisma.guild.create({ data: { guildId: guild.id } });
    } catch (error) {
      console.log(`[ERROR] [SCAN AND CREATE GUILDS] [${guild.name}]`, error);
    }
  });
};

export const createLeaderboard = (
  users: GuildUser[],
  prizes: LiveLeaderboardPrizes[]
) => {
  let lb = [];

  for (let i = 0; i < Math.min(users.length, 10); i++) {
    const prize = prizes.find((prize) => prize.position === i + 1)?.prize;
    lb.push(
      `> ${i + 1}. <@${users[i].userId}> - **\`${
        users[i].liveLeaderboardMessageCount
      }\`** ${prize ? `~ ${prize}` : ""}`
    );
  }

  return new EmbedBuilder().setTitle(
    "<:live:1319630764869943316> Live Leaderboard"
  ).setDescription(`
   
${lb.join("\n")}

-# Last updated - <t:${Math.floor(Date.now() / 1000)}:R>
`);
};
