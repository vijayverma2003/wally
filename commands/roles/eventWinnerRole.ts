import { EmbedBuilder, Message } from "discord.js";
import ms from "ms";
import { extractUserIdFromMention } from "../../services/utils";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "eventwinner",
  async execute(message: Message, args: string[]) {
    try {
      const validGuildId = ["1265547613956997130", "1135003551236628550"];

      if (!message.guild || !validGuildId.includes(message.guild.id)) return;

      const duration = args.shift();
      if (!duration) {
        await message.react("🚫");
        return;
      }

      const durationInMs = ms(duration);

      const roleId =
        process.env.NODE_ENV === "development"
          ? "1278023871953375325"
          : "1250935587859333230";

      const errors: string[] = [];

      for (let userId of args) {
        const id = extractUserIdFromMention(userId);

        try {
          const member = await message.guild?.members.fetch(id);

          if (!member) continue;

          let tempRole = await prisma.tempRole.findUnique({
            where: { userId_roleId: { userId: member.id, roleId: roleId } },
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
                roleId: roleId,
                endsAt: Date.now() + durationInMs,
              },
            });
          } else {
            tempRole = await prisma.tempRole.update({
              where: {
                userId_roleId: { userId: member.id, roleId: roleId },
              },
              data: {
                endsAt: Number(tempRole.endsAt) + durationInMs,
              },
            });
          }

          await member.roles.add(roleId);

          if (Number(tempRole.endsAt) + durationInMs < Date.now()) {
            await prisma.tempRole.delete({
              where: {
                userId_roleId: { userId: member.id, roleId: roleId },
              },
            });
            await member.roles.remove(roleId);
          }
        } catch (error) {
          errors.push(
            `- [Error] Giving <@&${roleId}> to <@${id}> for ${ms(
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
      else message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log("Error executing eventwinner role", error);
    }
  },
};
