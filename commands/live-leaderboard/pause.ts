import { Message } from "discord.js";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "lb-pause",
  async execute(message: Message) {
    try {
      if (!message.guild) return;

      await prisma.channel.updateMany({
        where: { guildId: message.guild.id },
        data: { liveLeaderboard: false },
      });

      await message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log(
        "Error executing the live-leaderboard-pause text command",
        error
      );
    }
  },
};
