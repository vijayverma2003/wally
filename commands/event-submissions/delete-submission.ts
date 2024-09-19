import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: "delete-submission",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild!.members.fetch(message.author.id);
      if (!hasPermissions(member)) return;

      const messageId = args.shift();
      if (!messageId) {
        await message.react("🚫");
        return;
      }

      const submission = await prisma.eventSubmission.findMany({
        where: { messageId },
      });

      if (!submission[0]) {
        await message.react("🚫");
        return;
      }

      await prisma.eventSubmission.delete({
        where: { id: submission[0].id },
      });

      await message.reply(
        "Submission deleted - please delete the submission message manually 😊"
      );
    } catch (error) {
      console.log("Error executing delete-submission command", error);
    }
  },
};
