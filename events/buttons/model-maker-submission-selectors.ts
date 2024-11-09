import {
  ActionRowBuilder,
  EmbedBuilder,
  Interaction,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { ButtonExecute } from ".";
import { prisma } from "../../prisma/client";
import { DiscordClient } from "../../types/main";

export default {
  customId: "modelmaker-submit",
  async execute(client: DiscordClient, interaction: Interaction) {
    try {
      if (!interaction.guildId) return;

      if (
        interaction.isButton() &&
        interaction.customId === "modelmaker-submit"
      ) {
        const submission = await prisma.modelMakerSubmission.create({
          data: {
            userId: interaction.user.id,
            guildId: interaction.guildId,
            startedAt: new Date(),
          },
        });

        const technologySelector = new StringSelectMenuBuilder()
          .setCustomId(`tech-selector-${submission.id}`)
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder("Select Technology")
          .addOptions(
            new StringSelectMenuOptionBuilder().setLabel("RVC").setValue("rvc"),
            new StringSelectMenuOptionBuilder()
              .setLabel("GPT-SoVits")
              .setValue("gptsovits")
          );

        const row =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            technologySelector
          );

        const embed = new EmbedBuilder()
          .setColor(0x8b93ff)
          .setTitle("Select Technology")
          .setDescription("Select the technology used to create your model.");

        await interaction.reply({
          components: [row],
          embeds: [embed],
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log("Error - Model Submission Button Interaction", error);
    }
  },
} as ButtonExecute;
