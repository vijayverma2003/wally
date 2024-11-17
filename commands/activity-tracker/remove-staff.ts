import { Message } from "discord.js";
import { hasPermissions } from "../../services/user";
import { prisma } from "../../prisma/client";
import { extractUserIdFromMention } from "../../services/utils";

module.exports = {
  name: "remove-staff",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild!.members.fetch(message.author.id);
      if (!hasPermissions(member)) return;

      let userId = args.shift();

      if (!userId) {
        await message.react("🚫");
        return;
      }

      userId = extractUserIdFromMention(userId);

      const guildUser = await prisma.guildUser.findUnique({
        where: { userId_guildId: { userId, guildId: message.guild!.id } },
      });

      if (guildUser) {
        await prisma.guildUser.update({
          where: { userId_guildId: { userId, guildId: message.guild!.id } },
          data: {
            isStaff: false,
          },
        });

        await message.react("✅");
        return;
      } else
        await message.reply("Oops, could not find the user in the database!");
    } catch (error) {
      console.log("Error occured while removing a staff member", error);
    }
  },
};
