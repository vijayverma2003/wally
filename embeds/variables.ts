import { EmbedBuilder } from "discord.js";
import emojis from "../services/emojis";

export default function variablesEmbed() {
  return new EmbedBuilder()
    .setTitle(`${emojis.exp} Variables for Custom Messages`)
    .setColor(0x8b93ff).setDescription(`
** **
- \`{user}\` ${emojis.whiteArrow} Guild User
- \`{level}\` ${emojis.whiteArrow} User Level
- \`{role}\` ${emojis.whiteArrow} Level Role
`);
}
