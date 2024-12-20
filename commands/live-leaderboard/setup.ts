import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "live-leaderboard",
  async execute(message: Message) {
    try {
      const guildDB = await prisma.guild.findUnique({
        where: { guildId: message.guildId! },
      });

      const embed = new EmbedBuilder()
        .setTitle("Live Leaderboard")
        .setDescription(
          `
Hello there, welcome to live leaderboard settings

**Channel** - ${guildDB?.liveLeaderboardChannelId ?? "Not added"}
**Reset Period** - ${guildDB?.liveLeaderboardResetPeriod ?? "Not added"}

-# Click the \`Start\` button to start the live leaderboard

`
        )
        .setColor(0xa594f9);

      const startButton = new ButtonBuilder()
        .setCustomId("live-leaderboard-start")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Start");

      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          startButton
        );

      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.log("Error executing the live-leaderboard text command", error);
    }
  },
};
