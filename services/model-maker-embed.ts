import { ModelMakerSubmission } from "@prisma/client";
import { EmbedBuilder, User } from "discord.js";

export default function createModelMakerEmbed(
  user: User,
  submission: ModelMakerSubmission
) {
  const embed = new EmbedBuilder()
    .setColor(0x8b93ff)
    .setAuthor({
      iconURL: user.displayAvatarURL(),
      name: user.username,
    })
    .setTitle(`New Model Submission`)
    .setDescription(
      `
**Model Name** - ${submission.modelName}
**Technology** - ${submission.technology}
**Extraction** - ${submission.extraction}
**Epochs** - ${submission.epochs}
**Model Link** - ${submission.modelLink}
      `
    )
    .setTimestamp(new Date());

  if (submission.notes) embed.setFooter({ text: submission.notes });

  return embed;
}
