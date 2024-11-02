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
  customId: "modelmaker-configuration-modal",
  async execute(client: DiscordClient, interaction: ButtonInteraction) {
    try {
      if (
        !interaction.guildId ||
        !interaction.isButton() ||
        interaction.customId !== "modelmaker-configuration-modal"
      )
        return;

      const modelMakerSetup = await prisma.modelMakerSetup.findUnique({
        where: { guildId: interaction.guildId },
      });

      const modal = new ModalBuilder()
        .setCustomId("modelmaker-configuration-modal")
        .setTitle("Model Maker Bot Configuration");

      const logChannelInput = new TextInputBuilder()
        .setCustomId("log-channel")
        .setLabel("Log Channel ID (For Staff)")
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(50)
        .setPlaceholder("Channel for logging in the submissions");

      const roleToAssignInput = new TextInputBuilder()
        .setCustomId("role")
        .setLabel("Role Assignment")
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(50)
        .setPlaceholder("Role to assign upon approval");

      const guidelinesInput = new TextInputBuilder()
        .setCustomId("guidelines")
        .setLabel("Guidelines for Submissions")
        .setMaxLength(4000)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      if (modelMakerSetup) {
        logChannelInput.setValue(modelMakerSetup.logChannel);
        roleToAssignInput.setValue(modelMakerSetup.roleToAssign);
        guidelinesInput.setValue(modelMakerSetup.guidelines);
      }

      const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
        logChannelInput
      );
      const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
        roleToAssignInput
      );
      const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(
        guidelinesInput
      );

      modal.addComponents(row1, row2, row3);

      await interaction.showModal(modal);
    } catch (error) {
      console.log("Error - Model Maker Configuration Button Interaction");
    }
  },
} as ButtonExecute;
