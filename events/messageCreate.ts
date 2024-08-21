import { Events, Message } from "discord.js";
import { prefix } from "..";
import { prisma } from "../prisma/client";
import { replacePlaceHolders } from "../services/placeholder";
import {
  expRequiredToReachNextLevel,
  getRandomNumberInRange,
} from "../services/utils";
import { DiscordClient } from "../types/main";

module.exports = {
  name: Events.MessageCreate,
  async execute(client: DiscordClient, message: Message) {
    if (message.channel.isDMBased() || message.author.bot || !message.guildId)
      return;

    // Levelling System

    try {
      const guild = await prisma.guild.findUnique({
        where: { guildId: message.guild?.id },
      });

      if (!guild) return;

      const guildUser = await prisma.guildUser.findUnique({
        where: { id: message.author.id },
      });

      if (!guildUser) {
        await prisma.guildUser.create({
          data: {
            id: message.author.id,
            experience: 1,
            guildId: guild.guildId,
          },
        });
      } else {
        const experience = getRandomNumberInRange(1, 10);
        const newExperience = guildUser.experience + experience;

        const levelUp =
          newExperience >= expRequiredToReachNextLevel(guildUser.level);

        await prisma.guildUser.update({
          where: { id: message.author.id },
          data: {
            experience: levelUp ? 1 : newExperience,
            level: levelUp ? guildUser.level + 1 : guildUser.level,
          },
        });

        if (levelUp) {
          const levelRole = await prisma.levelRole.findUnique({
            where: { guildId: message.guildId, level: guildUser.level + 1 },
          });

          // Assign Level Up Role

          if (levelRole) {
            try {
              const role = await message.guild?.roles.fetch(levelRole.roleId);

              if (role) {
                const member = await message.guild?.members.fetch(
                  message.author.id
                );

                if (member) await member.roles.add(role);
              }
            } catch (error) {
              console.log("Error while adding level role to a member", error);
            }
          }

          // Send Level Up Message in Log Channel

          if (guild.levelUpChannelId) {
            const channel = await message.guild?.channels.fetch(
              guild.levelUpChannelId
            );

            const levelUpMessage =
              levelUp && levelRole && guild.levelRoleMessage
                ? replacePlaceHolders(guild.levelRoleMessage, {
                    level: guildUser.level + 1,
                    roleId: `<@&${levelRole.roleId}>`,
                    userId: `<@${message.author.id}>`,
                  })
                : guild.levelUpMessage
                ? replacePlaceHolders(guild.levelUpMessage, {
                    userId: `<@${message.author.id}>`,
                    level: guildUser.level + 1,
                  })
                : `Congratulations ${message.author}, you reached level ${
                    guildUser.level + 1
                  }!`;

            if (channel?.isTextBased()) {
              await channel.send(levelUpMessage);
            }
          }
        }
      }
    } catch (error) {
      console.log("Error - Message Create Event", error);
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
          await command.execute(message, args, content);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log("Error while starting text command execution", error);
    }
  },
};
