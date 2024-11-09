import { ModelMakerSubmission } from "@prisma/client";
import { EmbedBuilder, User } from "discord.js";

export default function createModelMakerEmbed(
  user: User,
  submission: ModelMakerSubmission
) {
  return new EmbedBuilder()
    .setColor(0x8b93ff)
    .setAuthor({
      iconURL: user.displayAvatarURL(),
      name: user.username,
    })
    .setTitle(`New Model Submission`)
    .setDescription(
      `
** **                  
**Epoch Count** - ${submission.epochs ?? "N/A"}

**Model Link** - ${submission.modelLink}

**Additional Notes**
-# ${submission.notes ?? "N/A"}
`
    )
    .addFields(
      { name: "Model Name", value: submission.modelName ?? "N/A" },
      { name: "Technology", value: submission.technology ?? "N/A" },
      { name: "Extraction", value: submission.extraction ?? "N/A" }
    )
    .setTimestamp(new Date());
}
