import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: "levelrole-remove",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      if (!hasPermissions(member)) return;

      const level = args.shift();

      if (!level || isNaN(parseInt(level))) {
        await message.react("🚫");
        return;
      }

      const levelRole = await prisma.levelRole.findUnique({
        where: {
          guildId_level: {
            level: parseInt(level),
            guildId: message.guildId!,
          },
        },
      });

      if (!levelRole) {
        await message.reply(`Level role for level ${level} doesn't exists! 😅`);
      }

      await prisma.levelRole.delete({
        where: {
          guildId_level: {
            level: parseInt(level),
            guildId: message.guildId!,
          },
        },
      });

      await message.react("✅");
    } catch (error) {
      console.log("Error while executing levelrole-remove command", error);
    }
  },
};
