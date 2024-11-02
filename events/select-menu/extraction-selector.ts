import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Interaction,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { SelectMenuExecute } from ".";
import { prisma } from "../../prisma/client";
import { DiscordClient } from "../../types/main";

export default {
  startsWith: "extraction-selector",
  async execute(client: DiscordClient, interaction: Interaction) {
    try {
      if (!interaction.guildId) return;

      if (
        interaction.isStringSelectMenu() &&
        interaction.customId.startsWith("extraction-selector-")
      ) {
        const submissionId = interaction.customId.slice(
          "extraction-selector-".length
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
            data: { extraction: interaction.values[0] },
          });
        }

        const embed = new EmbedBuilder()
          .setColor(0x8b93ff)
          .setTitle("Model Submission Form")
          .setDescription(
            `
    ** **            
    Submit your model details below to qualify for the Model Maker role! Please ensure all information is accurate and follows our submission guidelines.
    
    **Fields to Complete**
    
    - **Model Name**: Enter the unique name of your model.            
    - **Epochs**: Specify the total epochs used in training.
    - **Model Link**: Provide the Hugging Face link to your model file.
    - **Demo File Link**: Share a link to a demo showcasing your model's output.
    - **Image Link**: Attach a link to an image representing your model.
    `
          )
          .setFooter({
            text: "Click the button below to fill in the form",
          });

        const button = new ButtonBuilder()
          .setCustomId(`modelmaker-submission-${id}`)
          .setLabel("Add Model Details")
          .setStyle(ButtonStyle.Success);

        const row =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            button
          );

        await interaction.update({
          embeds: [embed],
          components: [row],
        });
      }
    } catch (error) {
      console.log("Error - Model Submission Button Interaction", error);
    }
  },
} as SelectMenuExecute;
