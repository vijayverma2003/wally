import { Message } from "discord.js";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: "set-max-submissions",
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

      const count = args.shift();
      if (!count || isNaN(parseInt(count))) {
        await message.react("🚫");
        return;
      }

      await prisma.eventSubmissionSetup.update({
        where: { id: submissionSetup.id, guildId: message.guild!.id },
        data: { maxSubmissions: parseInt(count) },
      });

      await message.react("✅");
    } catch (error) {
      console.log("Error executing set-max-submissions command", error);
    }
  },
};
