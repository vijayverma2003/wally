import { AuditLogEvent, Events, Guild, GuildMember } from "discord.js";
import { prisma } from "../prisma/client";
import { DiscordClient } from "../types/main";
import { getFormattedDate } from "../services/utils";

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(
    client: DiscordClient,
    oldMember: GuildMember,
    newMember: GuildMember
  ) {
    try {
      console.log(oldMember.communicationDisabledUntil);
      console.log(newMember.communicationDisabledUntil);

      if (
        !oldMember.communicationDisabledUntil &&
        newMember.communicationDisabledUntil
      ) {
        const fetchedLogs = await newMember.guild.fetchAuditLogs({
          limit: 5,
          type: AuditLogEvent.MemberUpdate,
        });

        const timedOutLog = fetchedLogs.entries.find(
          (log) =>
            log.targetId === newMember.id &&
            log.changes.some(
              (change) => change.key === "communication_disabled_until"
            )
        );

        if (timedOutLog && timedOutLog.executorId) {
          const today = getFormattedDate();

          const user = await prisma.guildUser.findUnique({
            where: {
              userId_guildId: {
                userId: timedOutLog?.executorId,
                guildId: newMember.guild.id,
              },
            },
          });

          if (user && user.isStaff) {
            const staff = await prisma.staffActivity.findUnique({
              where: {
                userId_date: { userId: timedOutLog.executorId, date: today },
              },
            });

            if (!staff)
              await prisma.staffActivity.create({
                data: {
                  activity: {},
                  messageCount: 0,
                  userId: timedOutLog.executorId,
                  guildId: newMember.guild.id,
                  date: today,
                  mutes: 1,
                },
              });
            else
              await prisma.staffActivity.update({
                where: {
                  userId_date: { userId: timedOutLog.executorId, date: today },
                },
                data: { mutes: staff.mutes + 1 },
              });
          }
        }
      }
    } catch (error) {
      console.log("Event - GuildMemberUpdate", error);
    }
  },
};
