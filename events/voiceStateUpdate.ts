import { Client, Events, VoiceState } from "discord.js";
import ms from "ms";
import { prisma } from "../prisma/client";

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(client: Client, oldState: VoiceState, newState: VoiceState) {
    try {
      if (!oldState.member) return;

      if (!oldState.channelId && newState.channelId) {
        await prisma.guildUser.upsert({
          where: {
            userId_guildId: {
              userId: oldState.member?.id,
              guildId: oldState.guild.id,
            },
          },
          create: {
            userId: oldState.member.id,
            guildId: oldState.guild.id,
            vcLastJoinedAt: new Date(),
          },
          update: {
            userId: oldState.member.id,
            guildId: oldState.guild.id,
            vcLastJoinedAt: new Date(),
          },
        });
      }

      if (oldState.channelId && !newState.channelId) {
        const user = await prisma.guildUser.findUnique({
          where: {
            userId_guildId: {
              userId: oldState.member?.id,
              guildId: oldState.guild.id,
            },
          },
        });

        if (user?.vcLastJoinedAt) {
          const timeSpent = Date.now() - user.vcLastJoinedAt.getTime();
          const totalTimeSpent = user.vcTimeSpent
            ? user.vcTimeSpent + BigInt(timeSpent)
            : timeSpent;

          await prisma.guildUser.update({
            where: {
              userId_guildId: {
                userId: oldState.member?.id,
                guildId: oldState.guild.id,
              },
            },
            data: {
              vcLastJoinedAt: null,
              vcTimeSpent: totalTimeSpent,
            },
          });

          if (
            totalTimeSpent > ms("2 hours") &&
            user.guildId === "1159260121998827560"
          ) {
            try {
              const guild = await client.guilds.fetch(user.guildId);
              const member = await guild.members.fetch(user.userId);

              await member.roles.add("1313370998057205761"); // Adds streaming permissions role
            } catch (error) {
              console.log(
                "Error while assigning streaming permissions role - ",
                error
              );
            }
          }
        }
      }
    } catch (error) {
      console.log("Error - Voice State Update", error);
    }
  },
};
