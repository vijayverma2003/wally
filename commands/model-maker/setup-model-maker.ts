import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  MessageActionRowComponentBuilder,
} from "discord.js";

module.exports = {
  name: "model-maker-setup",
  async execute(message: Message) {
    try {
      const embed = new EmbedBuilder()
        .setTitle("Model Maker Bot Configuration")
        .setDescription(
          "-# **Welcome to the Model Maker Bot Setup! Use the `Configure Settings` button below to customize bot settings.**"
        )
        .setColor("#5865F2");

      const formButton = new ButtonBuilder()
        .setCustomId("modelmaker-configuration-modal")
        .setLabel("Configure Settings")
        .setStyle(ButtonStyle.Primary);

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
