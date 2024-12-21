import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: "set-levelup-message",
  async execute(message: Message, args: string[], content: string) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      if (!hasPermissions(member)) return;

      if (!content) {
        message.react("🚫");
      }

      await prisma.guild.update({
        where: { guildId: message.guildId! },
        data: {
          levelUpMessage: content.trim(),
        },
      });

      await message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log("Error executing set role message command", error);
    }
  },
};
