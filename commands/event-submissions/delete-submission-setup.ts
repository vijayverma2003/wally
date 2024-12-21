import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: "delete-submission-setup",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild!.members.fetch(message.author.id);
      if (!hasPermissions(member)) return;

      const submissionSetupId = args.shift();
      if (!submissionSetupId || isNaN(parseInt(submissionSetupId))) {
        await message.react("🚫");
        return;
      }

      const submissionSetup = await prisma.eventSubmissionSetup.findUnique({
        where: { id: parseInt(submissionSetupId), guildId: message.guild!.id },
      });

      if (!submissionSetup) {
        await message.react("🚫");
        return;
      }

      await prisma.eventSubmissionSetup.delete({
        where: { id: submissionSetup.id, guildId: message.guild!.id },
      });

      await message.react("<:checkmark:1319607871876632626>");
    } catch (error) {
      console.log("Error executing delete-submission-setup command", error);
    }
  },
};
