import { EmbedBuilder, Message } from "discord.js";
import ms from "ms";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";
import {
  extractRoleIdFromMention,
  extractUserIdFromMention,
} from "../../services/utils";

module.exports = {
  name: "temprole",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member || !hasPermissions(member)) return;

      const roleArg = args.shift();
      if (!roleArg) {
        await message.react("🚫");
        return;
      }

      const role = await message.guild?.roles.fetch(
        extractRoleIdFromMention(roleArg)
      );

      if (!role) {
        await message.reply("Invalid Role 😔");
        return;
      }

      const duration = args.shift();
      if (!duration) {
        await message.react("🚫");
        return;
      }

      const durationInMs = ms(duration);

      const errors: string[] = [];

      for (let userId of args) {
        const id = extractUserIdFromMention(userId);

        try {
          const member = await message.guild?.members.fetch(id);

          if (!member) continue;

          let tempRole = await prisma.tempRole.findUnique({
            where: { userId_roleId: { userId: member.id, roleId: role.id } },
          });

          let guildUser = await prisma.guildUser.findUnique({
            where: {
              userId_guildId: {
                userId: member.user.id,
                guildId: message.guildId!,
              },
            },
          });

          if (!guildUser)
            await prisma.guildUser.create({
              data: { userId: member.user.id, guildId: message.guildId! },
            });

          if (!tempRole) {
            tempRole = await prisma.tempRole.create({
              data: {
                userId: member.id,
                guildId: message.guildId!,
                roleId: role.id,
                endsAt: Date.now() + durationInMs,
              },
            });
          } else {
            tempRole = await prisma.tempRole.update({
              where: {
                userId_roleId: { userId: member.id, roleId: role.id },
              },
              data: {
                endsAt: Number(tempRole.endsAt) + durationInMs,
              },
            });
          }

          await member.roles.add(role.id);

          if (Number(tempRole.endsAt) + durationInMs < Date.now()) {
            await prisma.tempRole.delete({
              where: {
                userId_roleId: { userId: member.id, roleId: role.id },
              },
            });
            await member.roles.remove(role.id);
          }
        } catch (error) {
          errors.push(
            `- [Error] Giving <@&${role.id}> to <@${id}> for ${ms(
              durationInMs
            )}\n`
          );

          console.log("Error giving temporary role to a user", error);
        }
      }

      if (errors.length > 0)
        await message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Oops, We got some errors!")
              .setDescription(errors.join("")),
          ],
        });
      else message.react("✅");
    } catch (error) {}
  },
};
