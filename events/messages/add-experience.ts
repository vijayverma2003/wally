import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import {
  expRequiredToReachNextLevel,
  getRandomNumberInRange,
} from "../../services/utils";
import { levelUpMessage } from "../../services/levels";
import { assignRole } from "../../services/user";

export default async function addExperience(message: Message) {
  if (!message.channel.isThread()) {
    try {
      const guild = await prisma.guild.findUnique({
        where: { guildId: message.guild?.id },
      });

      if (!guild) return;

      const guildUser = await prisma.guildUser.findUnique({
        where: {
          userId_guildId: {
            userId: message.author.id,
            guildId: message.guildId!,
          },
        },
      });

      if (!guildUser) {
        await prisma.guildUser.create({
          data: {
            userId: message.author.id,
            experience: 1,
            guildId: guild.guildId,
          },
        });
      } else {
        const exp = getRandomNumberInRange(5, 15);
        const updatedExp = guildUser.experience + exp;

        const levelUp =
          updatedExp >= expRequiredToReachNextLevel(guildUser.level);

        // Update User - Add Experience

        await prisma.guildUser.update({
          where: {
            userId_guildId: {
              userId: message.author.id,
              guildId: message.guildId!,
            },
          },
          data: {
            experience: levelUp ? 1 : updatedExp,
            level: levelUp ? guildUser.level + 1 : guildUser.level,
          },
        });

        if (levelUp) {
          let levelRole = await prisma.levelRole.findUnique({
            where: {
              guildId_level: {
                level: guildUser.level + 1,
                guildId: message.guildId!,
              },
            },
          });

          if (levelRole) {
            const role = await message.guild!.roles.fetch(levelRole?.roleId);
            if (role)
              assignRole(message.guild!, message.author.id, levelRole.roleId);
            else levelRole = null;
          }

          if (guild.levelUpChannelId) {
            const channel = await message.guild?.channels.fetch(
              guild.levelUpChannelId
            );
            const messageContent = levelUpMessage(guildUser, guild, levelRole);
            if (channel?.isTextBased()) await channel.send(messageContent);
          }
        }
      }
    } catch (error) {
      console.log("Error - Updating User Experience", error);
    }
  }
}
