import { EmbedBuilder, Events, StringSelectMenuInteraction } from "discord.js";
import { DiscordClient } from "../../types/main";
import { prefix } from "../..";
import emojis from "../../services/emojis";
import { hasPermissions } from "../../services/user";

module.exports = {
  name: Events.InteractionCreate,
  async execute(
    client: DiscordClient,
    interaction: StringSelectMenuInteraction
  ) {
    try {
      if (
        !interaction.isStringSelectMenu() ||
        !interaction.customId.startsWith("help_") ||
        interaction.customId.slice("help_".length) !== interaction.user.id
      )
        return;

      let permitted = false;

      const member = await interaction.guild?.members.fetch(
        interaction.user.id
      );
      if (member && hasPermissions(member)) permitted = true;

      const embed = new EmbedBuilder().setColor(0x8b93ff);

      if (interaction.values[0] === "levelling") {
        embed.setTitle(`${emojis.leaderboard} Levelling Commands`);
        embed.setDescription(levellingHelpDescription(permitted));
      }

      if (interaction.values[0] === "roles") {
        embed.setTitle(`${emojis.roles} Roles Commands`);
        embed.setDescription(rolesHelpDescription());
      }

      if (interaction.values[0] === "event-submission") {
        embed.setTitle(`${emojis.settings} Event Submission Setup Commands`);
        embed.setDescription(eventSubmissionHelpDescription());
      }

      await interaction.message.edit({ embeds: [embed] });
      await interaction.deferUpdate();
    } catch (error) {
      console.log(
        "Interaction failed - Help - StringSelectMenyInteraction",
        error
      );
    }
  },
};

function levellingHelpDescription(permitted: boolean) {
  return `
    ** **
- \`${prefix}rank\` ${emojis.whiteArrow} Check user rank or level
- \`${prefix}leaderboard\` ${emojis.whiteArrow} Get rank leaderboard
${
  permitted
    ? `
- \`${prefix}addexp [amount] [...users]\` ${emojis.whiteArrow} Add or remove level experience to/from a user

- \`${prefix}levelrole-list\` ${emojis.whiteArrow} Lists all level roles
- \`${prefix}levelrole-add [level] [role]\` ${emojis.whiteArrow} Add a level role
- \`${prefix}levelrole-remove [level]\` ${emojis.whiteArrow} Remove a level role

- \`${prefix}set-levelup-channel [channel]\` ${emojis.whiteArrow} Set a channel for level up log messages
- \`${prefix}set-levelup-message [message]\` ${emojis.whiteArrow} Set a message to be sent when a user reaches a new level
- \`${prefix}set-levelup-rolemessage [message]\` ${emojis.whiteArrow} Set a message to be sent when a user reaches a new level and receives a role
- \`${prefix}variables\` ${emojis.whiteArrow} View all variables for custom messages
`
    : ""
}
`;
}

function rolesHelpDescription() {
  return `
    ** **
- \`${prefix}temprole [role] [duration] [...users]\` 
-# Assigns a temporary role to a user for the specified duration. The role is automatically removed when the time expires.
`;
}

function eventSubmissionHelpDescription() {
  return `
    ** **
- \`${prefix}submission-setup\` - Creates a new submission setup. 
- \`${prefix}delete-submission-setup [id]\` - Deletes a submission setup. 
- \`${prefix}send-submission-setup [id]\` - Sends submission setup for participants. 

- \`${prefix}set-max-submissions [id] [count]\` - Sets maximum submissions. 

- \`${prefix}delete-submission [messageId]\` - Deletes a submission. 
`;
}
