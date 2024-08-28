import {
  ActionRowBuilder,
  EmbedBuilder,
  Message,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import helpEmbed from "../../embeds/help";
import { hasPermissions } from "../../services/user";
import emojis from "../../services/emojis";
import { client } from "../..";

module.exports = {
  name: "help",
  async execute(message: Message) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      let permitted = false;
      if (hasPermissions(member)) permitted = true;

      const selectMenu = new StringSelectMenuBuilder()
        .setMaxValues(1)
        .setMinValues(1)
        .setCustomId(`help_${message.author.id}`)
        .setPlaceholder("Select a Category")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setEmoji(emojis.leaderboard)
            .setLabel("Levelling")
            .setDescription("Configure level settings, roles and messages")
            .setValue("levelling"),
          new StringSelectMenuOptionBuilder()
            .setEmoji(emojis.roles)
            .setLabel("Temporary Roles")
            .setDescription("Give temporary roles to users")
            .setValue("roles")
        );

      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          selectMenu
        );

      const embed = new EmbedBuilder()
        .setColor(0x8b93ff)
        .setTitle(`${client.user?.displayName} Commands`).setDescription(`
** **          
-# The prefix for commands is \`!\`

Select a category from the menu down below to view all related commands
`);

      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.log("Error while executing help command", error);
    }
  },
};
