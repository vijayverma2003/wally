import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: "add-vanity",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member || !hasPermissions(member)) return;

      const vanity = args.shift();
      if (!vanity) return;

      const guild = await prisma.guild.findUnique({
        where: { guildId: member.guild.id },
      });

      if (!guild) {
        const newGuild = await prisma.guild.create({
          data: { guildId: member.guild.id },
        });

        await prisma.guildVanity.create({
          data: { vanityURL: vanity.toLowerCase(), guildId: newGuild.guildId },
        });
      } else
        await prisma.guildVanity.create({
          data: { vanityURL: vanity.toLowerCase(), guildId: guild.guildId },
        });

      await message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log("Error while executing add-vanity command", error);
    }
  },
};
