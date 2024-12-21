import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { createLeaderboard } from "../../services/guild";

export default async function liveLeaderboard(message: Message) {
  try {
    if (!message.guildId) return;

    const guild = await prisma.guild.findUnique({
      where: { guildId: message.guildId },
    });

    if (!(guild?.liveLeaderboardChannelId && guild?.liveLeaderboardMessageId))
      return;

    const channel = await prisma.channel.findUnique({
      where: { channelId: message.channelId, guildId: message.guildId! },
    });

    if (channel?.liveLeaderboard === true) {
      const user = await prisma.guildUser.findUnique({
        where: {
          userId_guildId: {
            userId: message.author.id,
            guildId: message.guildId,
          },
        },
      });

      if (user)
        await prisma.guildUser.update({
          where: {
            userId_guildId: {
              userId: message.author.id,
              guildId: message.guildId,
            },
          },
          data: {
            liveLeaderboardMessageCount: user.liveLeaderboardMessageCount + 1,
          },
        });
      else
        await prisma.guildUser.create({
          data: {
            userId: message.author.id,
            guildId: message.guildId,
            liveLeaderboardMessageCount: 1,
          },
        });

      const leaderboard = await prisma.guildUser.findMany({
        where: { guildId: message.guildId },
        orderBy: { liveLeaderboardMessageCount: "desc" },
        take: 10,
      });

      if (leaderboard.find((user) => user.userId === message.author.id)) {
        if (guild?.liveLeaderboardChannelId) {
          const channel = await message.guild?.channels.fetch(
            guild.liveLeaderboardChannelId
          );

          if (channel?.isTextBased() && guild.liveLeaderboardMessageId) {
            const message = await channel.messages.fetch(
              guild.liveLeaderboardMessageId
            );

            const users = await prisma.guildUser.findMany({
              where: { guildId: message.guild.id },
              orderBy: { liveLeaderboardMessageCount: "desc" },
              take: 10,
            });

            const prizes = await prisma.liveLeaderboardPrizes.findMany({
              where: { guildId: message.guild.id },
            });

            if (message)
              await message.edit({
                embeds: [createLeaderboard(users, prizes)],
              });
          }
        }
      }
    }
  } catch (error) {
    console.log("Setting message count in live leaderboard", error);
  }
}
