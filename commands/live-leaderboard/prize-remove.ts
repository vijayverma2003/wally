import { Message } from "discord.js";
import { hasPermissions } from "../../services/user";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "lb-prize-remove",
  async execute(message: Message, args: string[], content: string) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member || !hasPermissions(member) || !message.guildId) return;

      const position = args.shift();

      if (!position || isNaN(parseInt(position))) {
        await message.reply("Uh oh! This is an invalid position :o");
        return;
      }

      const parseedPosition = parseInt(position);

      if (parseedPosition < 1 || parseedPosition > 10) {
        await message.reply(
          "Uh oh! This is an invalid position, make sure it ranges between 1-10 :sweat_smile:"
        );
        return;
      }

      await prisma.liveLeaderboardPrizes.delete({
        where: { position: parseedPosition, guildId: message.guildId },
      });

      await message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log("Error executing lb-prize-remove command", error);
    }
  },
};
