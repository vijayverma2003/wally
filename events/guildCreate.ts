import { Events, Guild } from "discord.js";
import { prisma } from "../prisma/client";
import { DiscordClient } from "../types/main";

module.exports = {
  name: Events.GuildCreate,
  async execute(client: DiscordClient, guild: Guild) {
    try {
      await prisma.guild.create({
        data: { guildId: guild.id, sendLevelUpMessage: false },
      });
    } catch (error) {
      console.log("[EVENT] [GUILD CREATE]", error);
    }
  },
};
