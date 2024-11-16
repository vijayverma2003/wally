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
  startsWith: "modelmaker-submission-",
  async execute(client: DiscordClient, interaction: ButtonInteraction) {
    try {
      if (
        !interaction.isButton() ||
        !interaction.customId.startsWith("modelmaker-submission-")
      )
        return;

      const submissionId = interaction.customId.slice(
        "modelmaker-submission-".length
      );
      const id = parseInt(submissionId);

      if (!id || isNaN(id)) {
        await interaction.reply({
          ephemeral: true,
          content: "Something failed!",
        });

        return;
      }

      const submission = await prisma.modelMakerSubmission.findUnique({
        where: { id },
      });

      if (!submission) {
        await interaction.reply({
          content: "An error occured - Could not find the submission",
          ephemeral: true,
        });

        return;
      }

      const form = new ModalBuilder()
        .setCustomId(`modelmaker-submission-${id}`)
        .setTitle("Model Details");

      const nameInput = new TextInputBuilder()
        .setCustomId("name")
        .setLabel("Model Name")
        .setMaxLength(150)
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      const epochInput = new TextInputBuilder()
        .setCustomId("epoch")
        .setLabel("Epoch")
        .setMaxLength(10)
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      const modelLinkInput = new TextInputBuilder()
        .setCustomId("model-link")
        .setLabel("Model Link (Weights.gg or Huggingface Link)")
        .setMaxLength(1000)
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      const notesInput = new TextInputBuilder()
        .setCustomId("notes")
        .setLabel("Is there something else you want to share?")
        .setMaxLength(1000)
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph);

      const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
        nameInput
      );
      const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
        epochInput
      );
      const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(
        modelLinkInput
      );
      const row4 = new ActionRowBuilder<TextInputBuilder>().addComponents(
        notesInput
      );

      form.addComponents(row1, row2, row3, row4);

      await interaction.showModal(form);
    } catch (error) {
      console.log("Error showing submission modal", error);
    }
  },
} as ButtonExecute;
