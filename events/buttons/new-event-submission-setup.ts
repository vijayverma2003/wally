import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { ButtonExecute } from ".";
import { hasPermissions } from "../../services/user";
import { DiscordClient } from "../../types/main";

export default {
  customId: "new-submission-setup",
  async execute(client: DiscordClient, interaction: ButtonInteraction) {
    try {
      if (
        !interaction.guild ||
        !interaction.isButton() ||
        interaction.customId !== "new-submission-setup"
      )
        return;

      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (!hasPermissions(member)) return;

      const modal = createSubmissionSetupModal();
      interaction.showModal(modal);
    } catch (error) {
      console.log("Error - New Submission Setup Button Interaction", error);
    }
  },
} as ButtonExecute;

function createSubmissionSetupModal() {
  const modal = new ModalBuilder()
    .setCustomId("submission-setup-modal")
    .setTitle("New Submission Setup");

  const titleInput = new TextInputBuilder()
    .setStyle(TextInputStyle.Short)
    .setLabel("Title")
    .setCustomId("title")
    .setMaxLength(250)
    .setRequired(true);

  const submissionChannelInput = new TextInputBuilder()
    .setStyle(TextInputStyle.Short)
    .setLabel("Submission Channel ID")
    .setCustomId("submission-channel-id")
    .setMaxLength(50)
    .setRequired(true);

  const timestampInput = new TextInputBuilder()
    .setStyle(TextInputStyle.Short)
    .setLabel("Event End Timestamp")
    .setCustomId("event-end-timestamp")
    .setMaxLength(50)
    .setRequired(false);

  const colorInput = new TextInputBuilder()
    .setStyle(TextInputStyle.Short)
    .setLabel("Embed Color")
    .setCustomId("embed-color")
    .setMaxLength(50)
    .setRequired(false);

  const descriptionInput = new TextInputBuilder()
    .setStyle(TextInputStyle.Paragraph)
    .setLabel("Description")
    .setCustomId("description")
    .setMaxLength(2000)
    .setRequired(false);

  const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
    titleInput
  );
  const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
    descriptionInput
  );
  const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(
    timestampInput
  );
  const row4 = new ActionRowBuilder<TextInputBuilder>().addComponents(
    colorInput
  );
  const row5 = new ActionRowBuilder<TextInputBuilder>().addComponents(
    submissionChannelInput
  );

  modal.addComponents(row1, row5, row3, row4, row2);

  return modal;
}
