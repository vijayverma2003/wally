import { Message } from "discord.js";
import { prisma } from "../../prisma/client";

export default async function liveMessageCount(message: Message) {
  try {
    const channel = await prisma.messageCountChannel.findUnique({
      where: { id: message.channelId },
    });

    if (channel) {
      const user = await prisma.messageCount.findUnique({
        where: {
          userId: message.author.id,
          messageCountChannelId: message.channelId,
        },
      });

      if (!user)
        await prisma.messageCount.create({
          data: {
            userId: message.author.id,
            messageCountChannelId: message.channelId,
            count: 1,
          },
        });
      else
        await prisma.messageCount.update({
          where: {
            userId: message.author.id,
            messageCountChannelId: message.channelId,
          },
          data: {
            count: user.count + 1,
          },
        });
    }
  } catch (error) {
    console.log("Setting message count", error);
  }
}
