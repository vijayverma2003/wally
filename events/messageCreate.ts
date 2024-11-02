import { Events, Message } from "discord.js";
import { prefix } from "../";
import { prisma } from "../prisma/client";
import {
  expRequiredToReachNextLevel,
  getRandomNumberInRange,
} from "../services/utils";
import { DiscordClient } from "../types/main";
import { levelUpMessage } from "../services/levels";
import { assignRole } from "../services/user";

module.exports = {
  name: Events.MessageCreate,
  async execute(client: DiscordClient, message: Message) {
    if (message.channel.isDMBased() || message.author.bot || !message.guild)
      return;

    try {
      const channel = await prisma.messageCountChannel.findUnique({
        where: { id: message.channelId },
      });

      if (channel) {
        const user = await prisma.messageCount.findUnique({
          where: {
            userId: message.author.id,
            messageCountChannelId: message.channelId,
          },
        });

        if (!user)
          await prisma.messageCount.create({
            data: {
              userId: message.author.id,
              messageCountChannelId: message.channelId,
              count: 1,
            },
          });
        else
          await prisma.messageCount.update({
            where: {
              userId: message.author.id,
              messageCountChannelId: message.channelId,
            },
            data: {
              count: user.count + 1,
            },
          });
      }
    } catch (error) {
      console.log("Setting message count", error);
    }

    // Update User Experience and Level

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
          const exp = getRandomNumberInRange(1, 5);
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
              const role = await message.guild.roles.fetch(levelRole?.roleId);
              if (role)
                assignRole(message.guild, message.author.id, levelRole.roleId);
              else levelRole = null;
            }

            if (guild.levelUpChannelId) {
              const channel = await message.guild?.channels.fetch(
                guild.levelUpChannelId
              );
              const messageContent = levelUpMessage(
                guildUser,
                guild,
                levelRole
              );
              if (channel?.isTextBased()) await channel.send(messageContent);
            }
          }
        }
      } catch (error) {
        console.log("Error - Updating User Experience", error);
      }
    }

    // Text Commands Execution

    try {
      if (message.content.toLowerCase().startsWith(prefix)) {
        let content = message.content.slice(prefix.length).trim();
        const args = content.split(/ +/);
        if (args.length === 0) return;

        const commandName = args.shift();
        if (!commandName) return;

        const command = client.commands?.get(commandName.toLowerCase());

        if (!command || !("execute" in command)) return;

        try {
          content = content.slice(command.name.length);
          command.execute(message, args, content);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log("Error while starting text command execution", error);
    }
  },
};
