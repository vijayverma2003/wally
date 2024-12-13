import { ButtonInteraction } from "discord.js";
import { DiscordClient } from "../../types/main";
import { prisma } from "../../prisma/client";
import { ButtonExecute } from ".";

export default {
  startsWith: "cancel-model-maker-submission-",
  async execute(client: DiscordClient, interaction: ButtonInteraction) {
    try {
      if (
        !interaction.guild ||
        !interaction.isButton() ||
        !interaction.customId.startsWith("cancel-model-maker-submission-")
      )
        return;

      const id = parseInt(
        interaction.customId.slice("cancel-model-maker-submission-".length)
      );

      if (!id || isNaN(id)) {
        await interaction.reply("Invalid Submission ID");
        return;
      }

      const submisssion = await prisma.modelMakerSubmission.findUnique({
        where: { id },
      });

      if (!submisssion) {
        await interaction.reply("Could not find the submission :sweat_smile:");
        return;
      }

      if (submisssion.submissionChannelId && submisssion.submissionMessageId) {
        const channel = await client.channels.fetch(
          submisssion.submissionChannelId
        );

        if (channel && channel.isTextBased()) {
          const message = await channel.messages.fetch(
            submisssion.submissionMessageId
          );

          await message.edit({
            components: [],
            content: "### Submission was cancelled!",
          });
        }
      }
    } catch (error) {
      console.log("Error - Cancelling Model Maker Submission", error);
    }
  },
} as ButtonExecute;
