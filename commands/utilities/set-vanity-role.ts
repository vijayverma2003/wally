import { Message } from "discord.js";
import { hasPermissions } from "../../services/user";
import { extractRoleIdFromMention } from "../../services/utils";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "set-vanity-role",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member || !hasPermissions(member)) return;

      const roleArg = args.shift();
      if (!roleArg) return;

      const roleId = extractRoleIdFromMention(roleArg);
      const role = await member.guild.roles.fetch(roleId);

      if (!role) {
        await message.reply("Invalid role...");
        return;
      }

      await prisma.guild.upsert({
        where: { guildId: member.guild.id },
        create: { guildId: member.guild.id, vanityRole: role.id },
        update: { guildId: member.guild.id, vanityRole: role.id },
      });

      await message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log("Error while executing set-vanity-role command", error);
    }
  },
};
