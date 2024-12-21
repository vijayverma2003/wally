import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { createLeaderboard } from "../../services/guild";
import { extractChannelIdFromMention } from "../../services/utils";

module.exports = {
  name: "lb-start",
  async execute(message: Message, args: string[]) {
    try {
      if (!message.guild) return;

      const channelId = args.shift();
      if (!channelId) return;

      const channels = await prisma.channel.findMany({
        where: { liveLeaderboard: true, guildId: message.guildId! },
      });

      if (channels.length <= 0) {
        const channels = await message.guild.channels.fetch();

        channels.forEach(async (channel) => {
          if (channel && channel.isTextBased())
            await prisma.channel.upsert({
              where: { guildId: message.guild?.id, channelId: channel.id },
              create: {
                liveLeaderboard: true,
                guildId: message.guild!.id,
                channelId: channel.id,
              },
              update: {
                liveLeaderboard: true,
              },
            });
        });
      }

      const lbChannel = await message.guild!.channels.fetch(
        extractChannelIdFromMention(channelId)
      );

      if (lbChannel?.isTextBased()) {
        const users = await prisma.guildUser.findMany({
          where: { guildId: message.guild.id },
          orderBy: { liveLeaderboardMessageCount: "desc" },
          take: 10,
        });

        const prizes = await prisma.liveLeaderboardPrizes.findMany({
          where: { guildId: message.guild.id },
        });

        try {
          const message = await lbChannel.send({
            embeds: [createLeaderboard(users, prizes)],
          });
          await prisma.guild.upsert({
            where: { guildId: message.guildId },
            create: {
              guildId: message.guildId,
              liveLeaderboardChannelId: extractChannelIdFromMention(channelId),
              liveLeaderboardMessageId: message.id,
            },
            update: {
              liveLeaderboardChannelId: extractChannelIdFromMention(channelId),
              liveLeaderboardMessageId: message.id,
            },
          });
        } catch (error) {
          await message.reply(
            "Error sending the live leaderboard, please make sure the permissions are well configured"
          );
        }
      }
    } catch (error) {
      console.log(
        "Error executing the live-leaderboard-start text command",
        error
      );
    }
  },
};
