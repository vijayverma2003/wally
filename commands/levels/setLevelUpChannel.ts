import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";
import { extractChannelIdFromMention } from "../../services/utils";

module.exports = {
  name: "set-levelup-channel",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      if (!hasPermissions(member)) return;

      const channelArg = args.shift();

      if (!channelArg) {
        await message.react("🚫");
        return;
      }

      const channelId = extractChannelIdFromMention(channelArg);
      const fetchedChannel = await message.guild?.channels.fetch(channelId);

      if (!fetchedChannel) {
        await message.react("🚫");
        return;
      }

      await prisma.guild.update({
        where: { guildId: message.guildId! },
        data: {
          levelUpChannelId: channelId,
        },
      });

      await message.react("✅");
    } catch (error) {
      console.log("Error while set level up channel command", error);
    }
  },
};
