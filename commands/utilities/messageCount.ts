import { Message } from "discord.js";
import { hasPermissions } from "../../services/user";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "message-count-start",
  async execute(message: Message) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      if (!hasPermissions(member)) return;

      const channel = await prisma.messageCountChannel.findUnique({
        where: { id: message.channelId },
      });

      if (channel) {
        await message.reply("Message count is already started in this channel");
        return;
      }

      await prisma.messageCountChannel.create({
        data: { id: message.channelId },
      });

      await message.react("✅");
    } catch (error) {
      console.log("Error executing message-count-start command", error);
    }
  },
};
