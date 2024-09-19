import {
  ColorResolvable,
  EmbedBuilder,
  Events,
  ModalSubmitInteraction,
} from "discord.js";
import { prisma } from "../../prisma/client";
import { isValidColor } from "../../services/utils";
import { DiscordClient } from "../../types/main";

module.exports = {
  name: Events.InteractionCreate,
  async execute(client: DiscordClient, interaction: ModalSubmitInteraction) {
    try {
      if (
        !interaction.guildId ||
        !interaction.isModalSubmit() ||
        interaction.customId !== "submission-setup-modal"
      )
        return;

      const title = interaction.fields.getField("title").value;
      const description = interaction.fields.getField("description").value;
      const eventEndTimestamp = interaction.fields.getField(
        "event-end-timestamp"
      ).value;
      const submissionChannelId = interaction.fields.getField(
        "submission-channel-id"
      ).value;
      const embedColor = interaction.fields.getField("embed-color").value;

      const eventSubmissionSetup = await prisma.eventSubmissionSetup.create({
        data: {
          guildId: interaction.guildId,
          title,
          description,
          eventEndTimestamp,
          submissionChannelId,
          embedColor: isValidColor(embedColor) ? embedColor : null,
        },
      });

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(
          isValidColor(embedColor) ? (embedColor as ColorResolvable) : null
        )
        .setDescription(description ? description : null);

      if (eventEndTimestamp)
        embed.setFields({
          name: "Ending at",
          value: `<t:${eventEndTimestamp}:F>`,
        });

      interaction.reply({
        content: `Created submission setup successfully! :relaxed:\n\n-# Use \`send-submission-setup ${eventSubmissionSetup.id}\` command to use the submission setup.\n** **\n`,
        ephemeral: true,
        embeds: [embed],
      });
    } catch (error) {
      console.log(
        "Error - SubmissionModalSetup - ModalSubmitInteraction",
        error
      );
    }
  },
};
