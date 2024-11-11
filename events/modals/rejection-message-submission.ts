import {
  EmbedBuilder,
  ModalSubmitInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { ModalSubmitExecute } from ".";
import { prisma } from "../../prisma/client";
import { DiscordClient } from "../../types/main";
import { hasPermissions } from "../../services/user";

export default {
  startsWith: "rejection-message-",
  async execute(client: DiscordClient, interaction: ModalSubmitInteraction) {
    try {
      if (
        !interaction.guildId ||
        !interaction.isModalSubmit() ||
        !interaction.customId.startsWith("rejection-message-")
      )
        return;

      const member = await interaction.guild?.members.fetch(
        interaction.user.id
      );
      if (!member) return;

      if (
        !(
          hasPermissions(member) ||
          member.permissions.has(PermissionFlagsBits.BanMembers) ||
          member.roles.cache.has("1159434617451978802")
        )
      )
        return;

      const submissionId = interaction.customId.slice(
        "rejection-message-".length
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
          content:
            "An error occured - Could not find the submission :confused:",
          ephemeral: true,
        });

        return;
      }

      const modelMakerSetup = await prisma.modelMakerSetup.findUnique({
        where: { guildId: interaction.guildId },
      });

      if (!modelMakerSetup) {
        await interaction.reply({
          content: "Could not find the server configuration :frowning2:",
          ephemeral: true,
        });
      }

      const message = interaction.fields.getTextInputValue("message");

      const embed = new EmbedBuilder()
        .setColor(0xd71313)
        .setTitle(`Your model has been rejected`)
        .setDescription(
          `
** **                  
**Model Name** - ${submission.modelName}
**Technology** - ${submission.technology}
**Extraction** - ${submission.extraction}
**Number of Epoch** - ${submission.epochs}
**Model Link** - ${submission.modelLink}

**Message** 
-# ${message}
`
        );

      if (message) {
        const user = await interaction.guild?.members.fetch(submission.userId);
        console.log(user?.user.username);

        try {
          await user?.send({
            embeds: [embed],
          });
        } catch (error) {
          console.log("Error sending rejection message to user", error);
        }

        await interaction.message?.edit({
          embeds: [
            new EmbedBuilder()
              .setColor(0xd71313)
              .setTitle(`Model Submission Rejected`)
              .setDescription(
                `
  ** **     
  **Submitted By** - <@${submission.userId}> (${submission.userId})

  **Model Name** - ${submission.modelName}
  **Technology** - ${submission.technology}
  **Extraction** - ${submission.extraction}
  **Number of Epoch** - ${submission.epochs}
  **Model Link** - ${submission.modelLink}

  **Rejected By** - ${interaction.user}

  **Message** 
  ${message}
  `
              ),
          ],
          components: [],
        });

        await interaction.reply({ content: "Awesome!", ephemeral: true });
      }
    } catch (error) {
      console.log("Error submitting rejection message for a model", error);
    }
  },
} as ModalSubmitExecute;
