import {
  ActionRowBuilder,
  EmbedBuilder,
  Interaction,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { SelectMenuExecute } from ".";
import { prisma } from "../../prisma/client";
import { DiscordClient } from "../../types/main";

export default {
  startsWith: "tech-selector",
  async execute(client: DiscordClient, interaction: Interaction) {
    try {
      if (!interaction.guildId) return;

      if (
        interaction.isStringSelectMenu() &&
        interaction.customId.startsWith("tech-selector-")
      ) {
        const submissionId = interaction.customId.slice(
          "tech-selector-".length
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

        if (interaction.values[0]) {
          await prisma.modelMakerSubmission.update({
            where: { id },
            data: { technology: interaction.values[0] },
          });

          const extractionSelector = new StringSelectMenuBuilder()
            .setCustomId(`extraction-selector-${id}`)
            .setPlaceholder("Select Extraction")
            .addOptions(
              new StringSelectMenuOptionBuilder().setLabel("pm").setValue("pm"),
              new StringSelectMenuOptionBuilder()
                .setLabel("harvest")
                .setValue("harvest"),
              new StringSelectMenuOptionBuilder()
                .setLabel("crepe")
                .setValue("crepe"),
              new StringSelectMenuOptionBuilder()
                .setLabel("mangio-crepe")
                .setValue("mangio-crepe"),
              new StringSelectMenuOptionBuilder()
                .setLabel("rmvpe")
                .setValue("rmvpe"),
              new StringSelectMenuOptionBuilder()
                .setLabel("dio")
                .setValue("dio")
            );

          const row =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              extractionSelector
            );

          const embed = new EmbedBuilder()
            .setColor(0x8b93ff)
            .setTitle("Select Extraction")
            .setDescription(
              "Choose the extraction method used in your model’s training process."
            );

          await interaction.update({
            components: [row],
            embeds: [embed],
          });
        }
      }
    } catch (error) {
      console.log("Error - Model Submission Button Interaction", error);
    }
  },
} as SelectMenuExecute;
