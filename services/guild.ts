import { Client } from "discord.js";
import { prisma } from "../prisma/client";

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
