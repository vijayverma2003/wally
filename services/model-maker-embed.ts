import { ModelMakerSubmission } from "@prisma/client";
import { EmbedBuilder, User } from "discord.js";

export default function createModelMakerEmbed(
  user: User,
  submission: ModelMakerSubmission
) {
  const embed = new EmbedBuilder()
    .setColor(0x8b93ff)
    .setTitle(`New Model Submission`)
    .setDescription(
      `
** **
**Submitted By** - <@${user.id}> (${user.id})

**Model Name** - ${submission.modelName}
**Technology** - ${submission.technology}
**Extraction** - ${submission.extraction}
**Epochs** - ${submission.epochs}
**Model Link** - ${submission.modelLink}
${
  submission.notes
    ? `
** **
-# ${submission.notes}`
    : "** **"
}
      `
    )
    .setTimestamp(new Date());

  return embed;
}
