import { Message } from "discord.js";
import { hasPermissions } from "../../services/user";
import { prisma } from "../../prisma/client";
import { extractChannelIdFromMention } from "../../services/utils";

module.exports = {
  name: "lb-channel-remove",
  async execute(message: Message, args: string[], content: string) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member || !hasPermissions(member) || !message.guildId) return;

      let channelId = args.shift();
      if (!channelId) return;

      channelId = extractChannelIdFromMention(channelId);

      const channel = await message.guild?.channels.fetch(channelId);
      if (!channel) {
        await message.reply("Invalid Channel :confused:");
        return;
      }

      await prisma.channel.upsert({
        where: { channelId: channel.id, guildId: message.guildId },
        create: {
          channelId: channel.id,
          liveLeaderboard: false,
          guildId: message.guildId,
        },
        update: { liveLeaderboard: false },
      });

      await message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log("Error executing lb-channel-remove command", error);
    }
  },
};
