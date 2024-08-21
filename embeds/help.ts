import { EmbedBuilder } from "discord.js";
import emojis from "../services/emojis";
import { prefix } from "..";

export default function helpEmbed(isAdmin: boolean) {
  return new EmbedBuilder()
    .setTitle(`${emojis.help} Commands List`)
    .setColor(0x8b93ff).setDescription(`
** **
${emojis.ranking} **Levels**

- \`${prefix}rank\` ${emojis.whiteArrow} Check user rank or level
- \`${prefix}leaderboard\` ${emojis.whiteArrow} Get rank leaderboard
${
  isAdmin
    ? `
- \`${prefix}addexp\` ${emojis.whiteArrow} Add or remove level experience to/from a user

- \`${prefix}levelrole-list\` ${emojis.whiteArrow} Lists all level roles
- \`${prefix}levelrole-add\` ${emojis.whiteArrow} Add a level role
- \`${prefix}levelrole-remove\` ${emojis.whiteArrow} Remove a level role

- \`${prefix}set-levelup-channel\` ${emojis.whiteArrow} Set a channel for level up log messages
- \`${prefix}set-levelup-message\` ${emojis.whiteArrow} Set a message to be sent when a user reaches a new level
- \`${prefix}set-levelup-rolemessage\` ${emojis.whiteArrow} Set a message to be sent when a user reaches a new level and receives a role
- \`${prefix}variables\` ${emojis.whiteArrow} View all variables for custom messages
`
    : ""
} 
`);
}
