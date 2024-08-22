import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { extractRoleIdFromMention } from "../../services/utils";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: "levelrole-add",
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

      const role = args.shift();

      if (!role) {
        await message.react("🚫");
        return;
      }

      const guildRole = await message.guild?.roles.fetch(
        extractRoleIdFromMention(role)
      );

      if (!guildRole) {
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

      if (!levelRole)
        await prisma.levelRole.create({
          data: {
            guildId: message.guildId!,
            level: parseInt(level),
            roleId: guildRole.id,
          },
        });
      else
        await prisma.levelRole.update({
          where: {
            guildId_level: {
              level: parseInt(level),
              guildId: message.guildId!,
            },
          },
          data: {
            roleId: guildRole.id,
          },
        });

      await message.react("✅");
    } catch (error) {
      console.log("Error while executing levelrole-add command", error);
    }
  },
};
