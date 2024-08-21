import { EmbedBuilder, Message } from "discord.js";
import { prisma } from "../../prisma/client";
import emojis from "../../services/emojis";

module.exports = {
  name: "leaderboard",
  async execute(message: Message) {
    try {
      const users = await prisma.guildUser.findMany({
        where: { guildId: message.guildId! },
        orderBy: [{ level: "desc" }, { experience: "desc" }],
        take: 10,
      });

      const mappedUsers = users
        .map(
          (user, index) =>
            `> ${index + 1}. <@${user.id}> ${emojis.whiteArrow} \`${
              user.level
            }\`\n`
        )
        .join("");

      const embed = new EmbedBuilder()
        .setTitle(`${emojis.ranking} Rank Leaderboard`)
        .setColor(0x8b93ff)
        .setDescription(mappedUsers)
        .setTimestamp(Date.now());

      await message.channel.send({
        embeds: [embed],
      });
    } catch (error) {
      console.log("Error while executing leaderboard command", error);
    }
  },
};
