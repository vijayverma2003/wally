import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
  ModalSubmitInteraction,
} from "discord.js";
import { ModalSubmitExecute } from ".";
import { prisma } from "../../prisma/client";
import createModelMakerEmbed from "../../services/model-maker-embed";
import { DiscordClient } from "../../types/main";

export default {
  startsWith: "modelmaker-submission-",
  async execute(client: DiscordClient, interaction: ModalSubmitInteraction) {
    try {
      if (
        !interaction.guildId ||
        !interaction.isModalSubmit() ||
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

      let submission = await prisma.modelMakerSubmission.findUnique({
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

      if (submission.submitted) {
        await interaction.reply({
          content:
            "You have already submitted a model, please dismiss this message and the message above and click on `Submit Model` button for new submission :grin:",
          ephemeral: true,
        });

        return;
      }

      const name = interaction.fields.getField("name").value;
      const epoch = interaction.fields.getField("epoch").value;
      const notes = interaction.fields.getField("notes").value;
      const modelLink = interaction.fields.getField("model-link").value;

      const epochAsNumber = parseInt(epoch);
      if (!epochAsNumber || isNaN(epochAsNumber)) {
        await interaction.reply({
          content: "Invalid Epoch Value",
          ephemeral: true,
        });
        return;
      }

      const urlPattern = /https:\/\/www\.weights\.gg\/models\/[a-zA-Z0-9]+/;
      const validPattern = urlPattern.test(modelLink);

      if (!validPattern) {
        await interaction.reply({
          content: "Model link should be a valid Weights.gg Model Link!",
          ephemeral: true,
        });
        return;
      }

      submission = await prisma.modelMakerSubmission.update({
        where: { id },
        data: {
          modelName: name,
          epochs: parseInt(epoch),
          notes,
          modelLink,
        },
      });

      try {
        const modelMakerSetup = await prisma.modelMakerSetup.findUnique({
          where: { guildId: interaction.guildId },
        });

        if (!modelMakerSetup?.logChannel) {
          await interaction.reply({
            content: "Error submitting the model submission",
            ephemeral: true,
          });

          return;
        }

        const logChannel = await interaction.guild?.channels.fetch(
          modelMakerSetup.logChannel
        );

        const logEmbed = createModelMakerEmbed(interaction.user, submission);

        const acceptButton = new ButtonBuilder()
          .setLabel("Accept")
          .setCustomId(`accept-model-${id}`)
          .setStyle(ButtonStyle.Success);

        const rejectButton = new ButtonBuilder()
          .setLabel("Reject")
          .setCustomId(`reject-model-${id}`)
          .setStyle(ButtonStyle.Danger);

        const row =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            acceptButton,
            rejectButton
          );

        if (logChannel && logChannel.isTextBased()) {
          await prisma.modelMakerSubmission.update({
            where: { id },
            data: { submitted: true },
          });

          await logChannel.send({
            embeds: [logEmbed],
            components: [row],
          });

          await interaction.reply({
            content: "Thanks for your submission! :blush:",
            ephemeral: true,
          });
        }
      } catch (error) {
        console.log("Error logging submission in the channel", error);
      }
    } catch (error) {
      console.log("Error submitting model maker submission", error);
    }
  },
} as ModalSubmitExecute;
