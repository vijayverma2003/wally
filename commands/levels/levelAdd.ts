import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";
import { extractUserIdFromMention } from "../../services/utils";

module.exports = {
  name: "setlevel",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      if (!hasPermissions(member)) return;

      const newLevel = args.shift();

      if (!newLevel || isNaN(parseInt(newLevel))) {
        await message.react("🚫");
        return;
      }

      const newLevelParsed = parseInt(newLevel);

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

          await prisma.guildUser.update({
            where: {
              userId_guildId: { userId: id, guildId: message.guildId! },
            },
            data: {
              level: newLevelParsed,
            },
          });
        } catch (error) {
          errors.push(`Error - Changing level for <@${id}>`);
          console.log("Error while changing level", error);
        }

        if (errors.length > 0) await message.channel.send(errors.join("\n"));
        else message.react("<:checkmark:1319607871876632626>");
      }
    } catch (error) {
      console.log("Error while executing setlevel command", error);
    }
  },
};
