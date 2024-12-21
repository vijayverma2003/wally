import { EmbedBuilder, Message } from "discord.js";
import { hasPermissions } from "../../services/user";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "lb-info",
  async execute(message: Message) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member || !hasPermissions(member) || !message.guildId) return;

      const guild = await prisma.guild.findUnique({
        where: { guildId: message.guildId },
      });

      const channels = await prisma.channel.findMany({
        where: { guildId: message.guildId, liveLeaderboard: true },
      });

      const isActive =
        guild?.liveLeaderboardChannelId && guild.liveLeaderboardMessageId;

      const mappedChannels = channels
        .map((channel, index) => `<#${channel.channelId}>`)
        .join(", ");

      const embed = new EmbedBuilder()
        .setTitle("Live Leaderboard Info")
        .setDescription(
          `
**Status** - ${isActive ? "ON" : "OFF"}
**Channel** - <#${guild?.liveLeaderboardChannelId}> 
**Message** - ${
            guild?.liveLeaderboardMessageId
              ? `https://discord.com/channels/${guild.guildId}/${guild.liveLeaderboardChannelId}/${guild.liveLeaderboardMessageId}`
              : "N/A"
          }

**Channels**
-# ${mappedChannels}
`
        )
        .setColor(0xe5d9f2);

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.log("Error executing lb-channel-list command", error);
    }
  },
};
