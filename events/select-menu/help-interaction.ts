import { EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { SelectMenuExecute } from ".";
import { prefix } from "../..";
import emojis from "../../services/emojis";
import { hasPermissions } from "../../services/user";
import { DiscordClient } from "../../types/main";

export default {
  startsWith: "help_",
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

      const embed = new EmbedBuilder().setColor(0xe5d9f2);

      if (interaction.values[0] === "levelling") {
        embed.setTitle(`Levelling System Guide`);
        embed.setDescription(levellingHelpDescription(permitted));
      }

      if (interaction.values[0] === "roles") {
        embed.setTitle(`Roles Commands Guide`);
        embed.setDescription(rolesHelpDescription());
      }

      if (interaction.values[0] === "event-submission") {
        embed.setTitle(`Event Submission Setup Command Guide`);
        embed.setDescription(eventSubmissionHelpDescription());
      }

      if (interaction.values[0] === "live-leaderboard") {
        embed.setTitle(`Live Leaderboard Setup Guide`);
        embed.setDescription(liveLeaderboardHelpDescription());
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
} as SelectMenuExecute;

function levellingHelpDescription(permitted: boolean) {
  return `
    ** **
- -# \`${prefix}rank\` \`${prefix}leaderboard\` 
-# Check your rank and leaderboard 
${
  permitted
    ? `
- -# \`${prefix}addexp [amount] [...users]\` 
-# Add or remove level experience to/from a user

- -# \`${prefix}levelrole-list\` 
-# Lists all level roles

- -# \`${prefix}levelrole-add [level] [role]\` \`${prefix}levelrole-remove [level]\` 
-# Add or remove a level role

- -# \`${prefix}set-levelup-channel [channel]\` 
-# Set a channel for level up log messages

- -# \`${prefix}set-levelup-message [message]\` 
-# Set a message to be sent when a user reaches a new level

- -# \`${prefix}set-levelup-rolemessage [message]\` 
-# Set a message to be sent when a user reaches a new level and receives a role

- -# \`${prefix}variables\` 
-# View all variables for custom messages
`
    : ""
}
`;
}

function rolesHelpDescription() {
  return `
    ** **
- -# \`${prefix}temprole [role] [duration] [...users]\` 
-# Assigns a temporary role to a user for the specified duration. The role is automatically removed when the time expires.
`;
}

function eventSubmissionHelpDescription() {
  return `
    ** **
- -# \`${prefix}submission-setup\`
-# Create a new submission setup

- -# \`${prefix}delete-submission-setup [id]\` 
-# Deletes a submission setup 

- -# \`${prefix}send-submission-setup [id]\` 
-# Sends submission setup for participants

- -# \`${prefix}set-max-submissions [id] [count]\` 
-# Sets maximum submissions 

- -# \`${prefix}delete-submission [messageId]\` 
-# Deletes a submission, make sure to delete the submission using the command before deleting the message itself
`;
}

function liveLeaderboardHelpDescription() {
  return `
**Commands**

- -# \`${prefix}lb-start [channelId]\` \`${prefix}lb-pause\` \`${prefix}lb-end\`
-# Start, pause or end the live leaderboard

- -# \`${prefix}lb-channel-add [channelId]\` \`${prefix}lb-channel-remove [channelId]\`
-# Add or remove a channel from live leaderboard

- -# \`${prefix}lb-channel-list\`
-# Lists all live leaderboard channels

- -# \`${prefix}lb-prize-add [position] [Prize]\` \`${prefix}lb-prize-remove [position]\` 
-# Setup prizes for different positions in the leaderboard

- -# \`${prefix}lb-reset-period [weekly | monthly]\` 
-# Ends a leaderboard every week or month

**Note that**

-# **If you start the live leaderboard without adding any channels, the live leaderboard will count messages in every channel. Use the pause command to stop the leaderboard. If you use the end command, the leaderboard will not worl anymore.**
`;
}
