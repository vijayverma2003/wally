import { AuditLogEvent, Events, GuildBan, GuildMember } from "discord.js";
import { prisma } from "../prisma/client";
import { DiscordClient } from "../types/main";
import { getFormattedDate } from "../services/utils";

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(client: DiscordClient, member: GuildMember) {
    try {
      const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 5,
        type: AuditLogEvent.MemberKick,
      });

      const kickLog = fetchedLogs.entries.find(
        (log) => log.targetId === member.id
      );

      if (kickLog && kickLog.executorId) {
        const today = getFormattedDate();

        const user = await prisma.guildUser.findUnique({
          where: {
            userId_guildId: {
              userId: kickLog?.executorId,
              guildId: member.guild.id,
            },
          },
        });

        if (user && user.isStaff) {
          const staff = await prisma.staffActivity.findUnique({
            where: {
              userId_date: { userId: kickLog.executorId, date: today },
            },
          });

          if (!staff)
            await prisma.staffActivity.create({
              data: {
                activity: {},
                messageCount: 0,
                userId: kickLog.executorId,
                guildId: member.guild.id,
                date: today,
                kicks: 1,
              },
            });
          else
            await prisma.staffActivity.update({
              where: {
                userId_date: { userId: kickLog.executorId, date: today },
              },
              data: { kicks: staff.kicks + 1 },
            });
        }
      }
    } catch (error) {
      console.log("Event - Guild Ban Add", error);
    }
  },
};
