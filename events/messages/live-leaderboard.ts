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
    }
  } catch (error) {
    console.log("Setting message count in live leaderboard", error);
  }
}
