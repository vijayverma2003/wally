import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { prisma } from "../../prisma/client";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: "submission-setup",
  async execute(message: Message) {
    try {
      const member = await message.guild!.members.fetch(message.author.id);
      if (!hasPermissions(member)) return;

      const submissionSetups = await prisma.eventSubmissionSetup.findMany({
        where: { guildId: message.guild!.id },
      });

      const mappedSubmissionSetups = submissionSetups
        .map(
          (submissionSetup, index) =>
            `${index + 1}. ${submissionSetup.title} (**${
              submissionSetup.id
            }**)\n`
        )
        .join("");

      const embed = new EmbedBuilder()
        .setColor(0xcdc1ff)
        .setTitle("Submissions Setup")
        .setDescription(
          mappedSubmissionSetups
            ? mappedSubmissionSetups
            : "No Submissions Setups Found"
        )
        .setFooter({
          text: `Click "New Submission Setup" to add new submission setup.`,
        });

      const button = new ButtonBuilder()
        .setCustomId("new-submission-setup")
        .setLabel("New Submission Setup")
        .setStyle(ButtonStyle.Primary);

      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          button
        );

      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.log("Error executing event-submission command", error);
    }
  },
};
