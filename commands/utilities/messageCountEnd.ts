import { EmbedBuilder, Message } from "discord.js";
import { hasPermissions } from "../../services/user";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "message-count-end",
  async execute(message: Message) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      if (!hasPermissions(member)) return;

      const users = await prisma.messageCount.findMany({
        where: { messageCountChannelId: message.channelId },
      });

      const mappedUsers = users
        .map((user, index) => `${index}. <@${user.userId}> (${user.count})`)
        .join("\n");

      const embed = new EmbedBuilder().setDescription(mappedUsers || "...");

      const user = await message.guild?.members.fetch("874540112371908628");

      await user?.send({ embeds: [embed] });

      await prisma.$transaction(async (tx) => {
        await tx.messageCount.deleteMany({
          where: { messageCountChannelId: message.channelId },
        });

        await tx.messageCountChannel.delete({
          where: { id: message.channelId },
        });
      });

      await message.react("✅");
    } catch (error) {
      console.log("Error executing message-count-end command", error);
    }
  },
};
