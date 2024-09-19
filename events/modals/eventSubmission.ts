import {
  Events,
  ModalSubmitInteraction,
  ThreadAutoArchiveDuration,
} from "discord.js";
import { prisma } from "../../prisma/client";
import { DiscordClient } from "../../types/main";

module.exports = {
  name: Events.InteractionCreate,
  async execute(client: DiscordClient, interaction: ModalSubmitInteraction) {
    try {
      if (
        !interaction.guildId ||
        !interaction.isModalSubmit() ||
        !interaction.customId.startsWith("event-submission-modal-")
      )
        return;

      const submissionSetupId = interaction.customId.slice(
        "event-submission-modal-".length
      );

      if (!submissionSetupId || isNaN(parseInt(submissionSetupId))) {
        await interaction.reply({
          content: "An error occured :slight_frown:",
          ephemeral: true,
        });
        return;
      }

      const submissionSetup = await prisma.eventSubmissionSetup.findUnique({
        where: {
          id: parseInt(submissionSetupId),
          guildId: interaction.guildId,
        },
      });

      if (!submissionSetup) {
        await interaction.reply({
          content: "An error occured :slight_frown:",
          ephemeral: true,
        });
        return;
      }

      if (
        submissionSetup.eventEndTimestamp &&
        Number(submissionSetup.eventEndTimestamp) * 1000 > Date.now()
      ) {
        await interaction.reply({
          content: "Event has ended 😥",
          ephemeral: true,
        });
      }

      const description = interaction.fields.getField("description").value;
      const submissionLink =
        interaction.fields.getField("submission-link").value;

      if (!description && !submissionLink) {
        await interaction.reply({
          content:
            "Invalid Submission! Please either add description or submission link. 😄",
          ephemeral: true,
        });
        return;
      }

      const channel = await client.channels.fetch(
        submissionSetup.submissionChannelId
      );

      if (!channel) {
        await interaction.reply({
          content: "Submission channel not found! :confused",
          ephemeral: true,
        });
      }

      if (channel?.isTextBased() || channel?.isThread()) {
        const message = await channel.send(`
Submission By - ${interaction.user}

-# **Description**
${description ? description : "..."}


-# **Link**
${submissionLink ? submissionLink : "..."}
`);

        await message.react("♥️");

        if (channel.isTextBased() && !message.hasThread) {
          message.startThread({
            name: ".",
            autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
            reason: "Event submission thread",
          });
        }
      }

      await interaction.reply({
        content: "Thanks for your submission! 🥰",
        ephemeral: true,
      });
    } catch (error) {
      console.log("Error - EventSubmission - ModalSubmitInteraction", error);
    }
  },
};
