import { Message } from "discord.js";
import { extractUserIdFromMention } from "../../services/utils";
import { prisma } from "../../prisma/client";
import { rankEmbed } from "../../embeds/levels";

module.exports = {
  name: "rank",
  async execute(message: Message, args: string[]) {
    try {
      let member = message.author;

      if (args.length > 0) {
        const userArg = args.shift();

        if (userArg) {
          const userId = extractUserIdFromMention(userArg);
          const guildUser = await message.guild?.members.fetch(userId);
          if (guildUser) member = guildUser.user;
        }
      }

      let user = await prisma.guildUser.findUnique({
        where: { id: member.id },
      });

      if (!user) {
        user = await prisma.guildUser.create({
          data: { id: member.id, guildId: message.guildId! },
        });
      }

      const users = await prisma.guildUser.findMany({
        where: { guildId: message.guildId! },
        orderBy: [{ level: "desc" }, { experience: "desc" }],
      });

      const index = users.findIndex((u) => u.id === user.id);

      await message.channel.send({
        embeds: [rankEmbed(member, user, index + 1)],
      });
    } catch (error) {
      console.log("Error while executing rank command", error);
    }
  },
};
