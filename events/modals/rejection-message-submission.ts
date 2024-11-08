import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ModalSubmitExecute } from ".";
import { prisma } from "../../prisma/client";
import { DiscordClient } from "../../types/main";

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
        .setAuthor({
          iconURL: interaction.user.displayAvatarURL(),
          name: interaction.user.username,
        })
        .setTitle(`Your model has been rejected! :frowning2:`)
        .setThumbnail(submission.imageLink)
        .setDescription(
          `
** **                  
**Model Name** - ${submission.modelName}

**Technology** - ${submission.technology}

**Extraction** - ${submission.extraction}

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
              .setAuthor({
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.username,
              })
              .setTitle(`New Model Submission`)
              .setThumbnail(submission.imageLink)
              .setDescription(
                `
  ** **                  
  **Model Name** - ${submission.modelName}
  
  **Technology** - ${submission.technology}
  
  **Extraction** - ${submission.extraction}
  
  **Number of Epoch** - ${submission.epochs}
  
  **Demo Link** 
  ${submission.demoFileLink}
  
  **Model Link** 
  ${submission.modelLink}

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
