import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { extractUserIdFromMention } from "../../services/utils";
import { hasPermissions } from "../../services/user";
import { addExperience, removeExperience } from "../../services/levels";

module.exports = {
  name: "addexp",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      if (!hasPermissions(member)) return;

      const experienceAmountArg = args.shift();

      if (!experienceAmountArg || isNaN(parseInt(experienceAmountArg))) {
        await message.react("🚫");
        return;
      }

      const experienceAmount = parseInt(experienceAmountArg);

      const errors: string[] = [];

      for (let user of args) {
        const id = extractUserIdFromMention(user);

        try {
          let guildUser = await prisma.guildUser.findUnique({
            where: {
              userId_guildId: { userId: id, guildId: message.guildId! },
            },
          });

          if (!guildUser)
            guildUser = await prisma.guildUser.create({
              data: { guildId: message.guildId!, userId: id },
            });

          const { level, experience } =
            experienceAmount > 0
              ? addExperience(guildUser, experienceAmount)
              : removeExperience(guildUser, experienceAmount);

          await prisma.guildUser.update({
            where: {
              userId_guildId: { userId: id, guildId: message.guildId! },
            },
            data: {
              level,
              experience,
            },
          });
        } catch (error) {
          errors.push(`Error - Adding experience to <@${id}>`);
          console.log("Error while adding experience", error);
        }

        if (errors.length > 0) await message.channel.send(errors.join("\n"));
        else message.react("✅");
      }
    } catch (error) {
      console.log("Error while executing give exp command", error);
    }
  },
};
