import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { LiveLeaderboardResetPeriod } from "@prisma/client";

module.exports = {
  name: "lb-reset-period",
  async execute(message: Message, args: string[]) {
    try {
      if (!message.guild) return;

      const resetPeriod = args.shift();
      if (!resetPeriod) {
        await message.reply(
          "Reset period should be either weekly or monthly :blush:"
        );
        return;
      }

      const validResetPeriods = ["weekly", "monthly"];

      if (!validResetPeriods.includes(resetPeriod)) {
        await message.reply(
          "Reset period should be either weekly or monthly :blush:"
        );
        return;
      }

      await prisma.guild.upsert({
        where: { guildId: message.guild.id },
        create: {
          liveLeaderboardResetPeriod: resetPeriod as LiveLeaderboardResetPeriod,
          guildId: message.guild.id,
        },
        update: {
          liveLeaderboardResetPeriod: resetPeriod as LiveLeaderboardResetPeriod,
        },
      });

      await message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log(
        "Error executing the live-leaderboard-end text command",
        error
      );
    }
  },
};
