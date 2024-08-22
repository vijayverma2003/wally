import { EmbedBuilder, Message } from "discord.js";
import emojis from "../../services/emojis";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: "levelrole-list",
  async execute(message: Message) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      if (!hasPermissions(member)) return;

      const levelRole = await prisma.levelRole.findMany({
        where: { guildId: message.guildId! },
        orderBy: { level: "asc" },
      });

      const mappedLevelRoles = levelRole
        .map(
          (role, index) =>
            `> ${index + 1}. <@&${role.roleId}> ${emojis.whiteArrow} [${
              role.level
            }]\n`
        )
        .join("");

      const embed = new EmbedBuilder()
        .setColor(0x8b93ff)
        .setTitle(`${emojis.roles} Level Roles`)
        .setDescription(mappedLevelRoles)
        .setTimestamp(Date.now());

      await message.channel.send({
        embeds: [embed],
      });
    } catch (error) {
      console.log("Error while executing level role list command", error);
    }
  },
};
