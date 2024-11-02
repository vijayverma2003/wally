import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { prisma } from "../../prisma/client";

module.exports = {
  name: "model-maker-form",
  async execute(message: Message) {
    try {
      if (!message.guildId) return;

      const modelMakerSetup = await prisma.modelMakerSetup.findUnique({
        where: { guildId: message.guildId },
      });

      if (!modelMakerSetup) {
        await message.reply(
          "Couldn't find Model Maker Configuration :frowning2:"
        );

        return;
      }

      const embed = new EmbedBuilder()
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/1265562525907288137/1302176623013003296/image.png?ex=672729fc&is=6725d87c&hm=7a65a29176358d54bf53b0c692a6403af56bc5b8b571ef08f0a45457acaf5085&"
        )
        .setTitle("Model Maker Submission Portal")
        .setDescription(
          `
Welcome to the Model Maker Submission Portal! Fill out the required fields to submit your model for review. Once submitted, our team will review the details, and upon approval, you'll receive the Model Maker role. Ensure all links are valid and files adhere to the community standards. Click the \`Submit Model\` button below to get started!
          
**Submission Guidelines**

${modelMakerSetup.guidelines}`
        )
        .setColor(0x8b93ff);

      const formButton = new ButtonBuilder()
        .setCustomId("modelmaker-submit")
        .setLabel("Submit Model")
        .setStyle(ButtonStyle.Success);

      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          formButton
        );

      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.log("Error sending model maker bot configuration embed", error);
    }
  },
};
