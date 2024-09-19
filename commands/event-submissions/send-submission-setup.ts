import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
  Message,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { hasPermissions } from "../../services/user";
import { prisma } from "../../prisma/client";
import { isValidColor } from "../../services/utils";

module.exports = {
  name: "send-submission-setup",
  async execute(message: Message, args: string[]) {
    try {
      const member = await message.guild!.members.fetch(message.author.id);
      if (!hasPermissions(member)) return;

      const submissionSetupId = args.shift();
      if (!submissionSetupId || isNaN(parseInt(submissionSetupId))) return;

      const submissionSetup = await prisma.eventSubmissionSetup.findUnique({
        where: { id: parseInt(submissionSetupId), guildId: message.guild!.id },
      });

      if (!submissionSetup) return;

      const embed = new EmbedBuilder()
        .setTitle(submissionSetup.title)
        .setColor(
          isValidColor(submissionSetup.embedColor)
            ? (submissionSetup.embedColor as ColorResolvable)
            : null
        )
        .setDescription(
          submissionSetup.description ? submissionSetup.description : null
        );

      if (submissionSetup.eventEndTimestamp)
        embed.setFields({
          name: "Ending at",
          value: `<t:${submissionSetup.eventEndTimestamp}:F>`,
        });

      const button = new ButtonBuilder()
        .setLabel("Submit Here")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`event-submission-${submissionSetup.id}`);

      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          button
        );

      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.log("Error executing send-submission-setup command", error);
    }
  },
};
