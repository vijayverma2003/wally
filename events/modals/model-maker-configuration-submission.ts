import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ModalSubmitExecute } from ".";
import { prefix } from "../..";
import { prisma } from "../../prisma/client";
import { DiscordClient } from "../../types/main";

export default {
  customId: "modelmaker-configuration-modal",
  async execute(client: DiscordClient, interaction: ModalSubmitInteraction) {
    try {
      if (
        !interaction.guildId ||
        !interaction.isModalSubmit() ||
        interaction.customId !== "modelmaker-configuration-modal"
      )
        return;

      const logChannel = interaction.fields.getField("log-channel").value;
      const roleToAssign = interaction.fields.getField("role").value;
      const guidelines = interaction.fields.getField("guidelines").value;

      const guild = await prisma.guild.findUnique({
        where: { guildId: interaction.guildId },
      });

      if (!guild)
        await prisma.guild.create({ data: { guildId: interaction.guildId } });

      const modelMakerSetup = await prisma.modelMakerSetup.findUnique({
        where: { guildId: interaction.guildId },
      });

      if (modelMakerSetup) {
        await prisma.modelMakerSetup.update({
          where: { guildId: interaction.guildId },
          data: {
            guidelines,
            roleToAssign,
            logChannel,
          },
        });
      } else
        await prisma.modelMakerSetup.create({
          data: {
            guildId: interaction.guildId,
            guidelines,
            roleToAssign,
            logChannel,
          },
        });

      await interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `**Bot Configuration is updated!**\n-# Use \`${prefix}model-maker-form\` to view the form`
            )
            .setColor("#5865F2"),
        ],
      });
    } catch (error) {
      console.log("Error submitting model maker conf modal", error);
    }
  },
} as ModalSubmitExecute;
