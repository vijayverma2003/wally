import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { getFormattedDate } from "../../services/utils";

export default async function trackActivity(message: Message) {
  const today = getFormattedDate();

  try {
    const channel = await prisma.channelActivity.findUnique({
      where: {
        channelId_date: { channelId: message.channelId, date: today },
      },
    });

    if (!channel)
      await prisma.channelActivity.create({
        data: {
          channelId: message.channelId,
          date: today,
          guildId: message.guildId!,
          messageCount: 1,
        },
      });
    else
      await prisma.channelActivity.update({
        where: {
          channelId_date: { channelId: message.channelId, date: today },
        },
        data: {
          channelId: message.channelId,
          date: today,
          guildId: message.guildId!,
          messageCount: channel.messageCount + 1,
        },
      });
  } catch (error) {
    console.log("Error occured while tracking channel activity -", error);
  }

  try {
    const user = await prisma.guildUser.findUnique({
      where: {
        userId_guildId: {
          userId: message.author.id,
          guildId: message.guildId!,
        },
      },
    });

    if (user && user.isStaff) {
      const staff = await prisma.staffActivity.findUnique({
        where: {
          userId_date: { userId: message.author.id, date: today },
        },
      });

      if (!staff)
        await prisma.staffActivity.create({
          data: {
            userId: message.author.id,
            guildId: message.guildId!,
            date: today,
            messageCount: 1,
            activity: {
              [message.channelId]: 1,
            },
          },
        });
      else {
        const activity = staff.activity as { [channelId: string]: number };

        if (activity[message.channelId])
          activity[message.channelId] = activity[message.channelId] + 1;
        else activity[message.channelId] = 1;

        await prisma.staffActivity.update({
          where: {
            userId_date: { userId: message.author.id, date: today },
          },
          data: {
            userId: message.author.id,
            guildId: message.guildId!,
            date: today,
            messageCount: staff.messageCount + 1,
            activity,
          },
        });
      }
    }
  } catch (error) {
    console.log("Error occured while tracking user activity -", error);
  }
}