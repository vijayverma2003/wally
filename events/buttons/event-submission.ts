import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { ButtonExecute } from ".";
import { prisma } from "../../prisma/client";
import { DiscordClient } from "../../types/main";

export default {
  startsWith: "event-submission-",
  async execute(client: DiscordClient, interaction: ButtonInteraction) {
    try {
      if (
        !interaction.guild ||
        !interaction.isButton() ||
        !interaction.customId.startsWith("event-submission-")
      )
        return;

      const submissionSetupId = parseInt(
        interaction.customId.slice("event-submission-".length)
      );

      if (isNaN(submissionSetupId)) {
        await interaction.reply({
          ephemeral: true,
          content: "An error occured :slight_frown:",
        });
      }

      const submissionSetup = await prisma.eventSubmissionSetup.findUnique({
        where: { id: submissionSetupId },
      });

      if (!submissionSetup) return;

      const totalSubmissions = await prisma.eventSubmission.aggregate({
        _count: true,
        where: {
          eventSubmissionSetupId: submissionSetup.id,
          userId: interaction.user.id,
        },
      });

      if (
        submissionSetup.maxSubmissions &&
        totalSubmissions._count >= Number(submissionSetup.maxSubmissions)
      ) {
        await interaction.reply({
          content: "You have reached the submission limit 😅",
          ephemeral: true,
        });

        return;
      }

      const modal = createEventSubmissionModal(submissionSetupId);
      interaction.showModal(modal);
    } catch (error) {
      console.log("Error - New Submission Setup Button Interaction", error);
    }
  },
} as ButtonExecute;

function createEventSubmissionModal(id: number) {
  const modal = new ModalBuilder()
    .setCustomId(`event-submission-modal-${id}`)
    .setTitle("Your Submission");

  const linkInput = new TextInputBuilder()
    .setStyle(TextInputStyle.Short)
    .setLabel("Submission Link")
    .setCustomId("submission-link")
    .setMaxLength(1000)
    .setRequired(false);

  const descriptionInput = new TextInputBuilder()
    .setStyle(TextInputStyle.Paragraph)
    .setLabel("Describe your submission")
    .setCustomId("description")
    .setMaxLength(2000)
    .setRequired(false);

  const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
    descriptionInput
  );
  const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
    linkInput
  );

  modal.addComponents(row1, row2);

  return modal;
}
