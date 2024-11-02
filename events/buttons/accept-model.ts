import {
  ActionRowBuilder,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { ButtonExecute } from ".";
import { prisma } from "../../prisma/client";
import { DiscordClient } from "../../types/main";

export default {
  startsWith: "accept-model-",
  async execute(client: DiscordClient, interaction: Interaction) {
    try {
      if (
        !interaction.isButton() ||
        !interaction.customId.startsWith("accept-model-")
      )
        return;
      const submissionId = interaction.customId.slice("accept-model-".length);
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
          content:
            "An error occured - Could not find the submission :confused:",
          ephemeral: true,
        });

        return;
      }

      const messageModal = new ModalBuilder()
        .setCustomId(`acception-message-${id}`)
        .setTitle("Send a Message");

      const messageField = new TextInputBuilder()
        .setCustomId("message")
        .setLabel("Message")
        .setMaxLength(500)
        .setStyle(TextInputStyle.Paragraph);

      const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
        messageField
      );

      messageModal.addComponents(row);

      interaction.showModal(messageModal);
    } catch (error) {
      console.log("Error - accept model submission button interaction", error);
    }
  },
} as ButtonExecute;
