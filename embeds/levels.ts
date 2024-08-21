import { GuildUser } from "@prisma/client";
import { EmbedBuilder, GuildMember, User } from "discord.js";
import { createProgressBar } from "../services/levels";
import emojis from "../services/emojis";

export function rankEmbed(guildUser: User, user: GuildUser, rank: number) {
  const { progressBar } = createProgressBar(user.level * 100, user.experience);

  return new EmbedBuilder()
    .setColor(0x8b93ff)
    .setAuthor({
      name: guildUser.username,
      iconURL: guildUser.displayAvatarURL(),
    })
    .setDescription(
      `** **
> **${emojis.ranking} \`#${rank}\` Server Rank**
> ** **
> **${emojis.level} \`${user.level}\` Level**
> ** **
> ${emojis.star} **\`${
        user.level * 100 - user.experience
      }\` XP needed to level up!**
    
      ${progressBar}`
    )
    .setTimestamp(Date.now());
}
