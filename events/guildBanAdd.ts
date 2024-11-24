import { AuditLogEvent, Events, GuildBan } from "discord.js";
import { prisma } from "../prisma/client";
import { getFormattedDate } from "../services/utils";
import { DiscordClient } from "../types/main";

module.exports = {
  name: Events.GuildBanAdd,
  async execute(client: DiscordClient, ban: GuildBan) {
    try {
      const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanAdd,
      });

      const banLog = fetchedLogs.entries.first();

      if (banLog && banLog.executorId) {
        const today = getFormattedDate();

        const user = await prisma.guildUser.findUnique({
          where: {
            userId_guildId: {
              userId: banLog?.executorId,
              guildId: ban.guild.id,
            },
          },
        });

        if (user && user.isStaff) {
          const staff = await prisma.staffActivity.findUnique({
            where: {
              userId_date: { userId: banLog.executorId, date: today },
            },
          });

          if (!staff)
            await prisma.staffActivity.create({
              data: {
                activity: {},
                messageCount: 0,
                userId: banLog.executorId,
                guildId: ban.guild.id,
                date: today,
                bans: 1,
              },
            });
          else
            await prisma.staffActivity.update({
              where: {
                userId_date: { userId: banLog.executorId, date: today },
              },
              data: { bans: staff.bans + 1 },
            });
        }
      }
    } catch (error) {
      console.log("Event - Guild Ban Add", error);
    }
  },
};
