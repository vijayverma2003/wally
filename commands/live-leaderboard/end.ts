import { Message } from "discord.js";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "lb-end",
  async execute(message: Message) {
    try {
      if (!message.guild) return;

      await prisma.channel.updateMany({
        where: { guildId: message.guild.id },
        data: { liveLeaderboard: false },
      });

      await prisma.guildUser.updateMany({
        where: { guildId: message.guild.id },
        data: { liveLeaderboardMessageCount: 0 },
      });

      const guild = await prisma.guild.findUnique({
        where: { guildId: message.guild.id },
      });

      if (guild) {
        await prisma.guild.update({
          where: { guildId: message.guild.id },
          data: {
            liveLeaderboardChannelId: null,
            liveLeaderboardResetPeriod: null,
            liveLeaderboardMessageId: null,
          },
        });
      }

      await message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log(
        "Error executing the live-leaderboard-end text command",
        error
      );
    }
  },
};
