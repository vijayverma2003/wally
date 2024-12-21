import { EmbedBuilder, Message } from "discord.js";
import { hasPermissions } from "../../services/user";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "lb-channel-list",
  async execute(message: Message) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member || !hasPermissions(member) || !message.guildId) return;

      const channels = await prisma.channel.findMany({
        where: { guildId: message.guildId, liveLeaderboard: true },
      });

      const mappedChannels = channels
        .map((channel, index) => `${index + 1}. <#${channel.channelId}>`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle("Leaderboard Channels")
        .setDescription(mappedChannels ? mappedChannels : "...")
        .setColor(0xa594f9);

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.log("Error executing lb-channel-list command");
    }
  },
};
