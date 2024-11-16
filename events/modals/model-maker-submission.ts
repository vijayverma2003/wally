import {
  ActionRowBuilder,
  Attachment,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  ModalSubmitInteraction,
} from "discord.js";
import { ModalSubmitExecute } from ".";
import { prisma } from "../../prisma/client";
import createModelMakerEmbed from "../../services/model-maker-embed";
import { DiscordClient } from "../../types/main";

export default {
  startsWith: "modelmaker-submission-",
  async execute(client: DiscordClient, interaction: ModalSubmitInteraction) {
    try {
      if (
        !interaction.guildId ||
        !interaction.isModalSubmit() ||
        !interaction.customId.startsWith("modelmaker-submission-")
      )
        return;

      const submissionId = interaction.customId.slice(
        "modelmaker-submission-".length
      );

      const id = parseInt(submissionId);

      if (!id || isNaN(id)) {
        await interaction.reply({
          ephemeral: true,
          content: "Something failed!",
        });

        return;
      }

      let submission = await prisma.modelMakerSubmission.findUnique({
        where: { id },
      });

      if (!submission) {
        await interaction.reply({
          content:
            "An error occured - Could not find the submission :confused:",
          ephemeral: true,
        });

        return;
      }

      if (submission.submitted) {
        await interaction.reply({
          content:
            "You have already submitted a model, please dismiss this message and the message above and click on `Submit Model` button for new submission :grin:",
          ephemeral: true,
        });

        return;
      }

      const name = interaction.fields.getField("name").value;
      const epoch = interaction.fields.getField("epoch").value;
      const notes = interaction.fields.getField("notes").value;
      const modelLink = interaction.fields.getField("model-link").value;

      const epochAsNumber = parseInt(epoch);
      if (!epochAsNumber || isNaN(epochAsNumber)) {
        await interaction.reply({
          content: "Invalid Epoch Value",
          ephemeral: true,
        });
        return;
      }

      const weightsUrlPattern =
        /https:\/\/www\.weights\.gg\/models\/[a-zA-Z0-9]+/;
      const weightsValidPattern = weightsUrlPattern.test(modelLink);

      const huggingFaceUrlPattern =
        /https:\/\/huggingface\.co\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/resolve\/main\/[a-zA-Z0-9._-]+\.zip/;
      const huggingFaceValidPattern = huggingFaceUrlPattern.test(modelLink);

      if (!weightsValidPattern && !huggingFaceValidPattern) {
        await interaction.reply({
          content:
            "Model link should be a valid Weights.gg or Huggingface Model Link!",
          ephemeral: true,
        });
        return;
      }

      submission = await prisma.modelMakerSubmission.update({
        where: { id },
        data: {
          modelName: name,
          epochs: parseInt(epoch),
          notes,
          modelLink,
        },
      });

      let attachment;

      const dmChannel = await interaction.user.createDM();

      if (!dmChannel) {
        await interaction.reply({
          content: "Oops, I could not send you a dm :confused",
          ephemeral: true,
        });

        return;
      }

      if (huggingFaceValidPattern) {
        await interaction.reply({
          content: "Sent you a dm! Please upload a demo file there :D",
          ephemeral: true,
        });

        await dmChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Submit Demo File")
              .setDescription(
                "Submit one demo file using your model with it singing or talking. Don't add any effects to the voice output itself (e.g echo, reverb, noise etc.) and for singing models don't include instrumentals in the background for the sake of evaluating your model. If you fail to meet said requirements, we may reject your model.\n** **\n**You have 10 minutes to submit your file**"
              ),
          ],
        });

        const filter = (msg: any) =>
          msg.author.id === interaction.user.id && msg.attachments.size > 0;

        try {
          const collected = await dmChannel.awaitMessages({
            filter,
            max: 1,
            time: 600000, // 10 minute timeout
            errors: ["time"],
          });

          const fileMessage = collected.first();

          if (!fileMessage) {
            await dmChannel.send({
              embeds: [
                new EmbedBuilder().setDescription(
                  "File upload timed out. Please start the submission process again."
                ),
              ],
            });
            return;
          }

          const fileAttachment = fileMessage.attachments.first() as Attachment;

          if (!fileAttachment) {
            await dmChannel.send({
              embeds: [
                new EmbedBuilder().setDescription(
                  "No valid file was uploaded. Please start the submission process again."
                ),
              ],
            });

            return;
          }

          const fileName = fileAttachment.name;
          const fileExtension = fileName.split(".").pop()?.toLowerCase();

          const allowedExtensions = ["mp3", "wav", "ogg", "flac", "m4a"];

          if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            await dmChannel.send({
              embeds: [
                new EmbedBuilder().setDescription(
                  `Invalid file type! Please upload a sound file with one of the following extensions: ${allowedExtensions.join(
                    ", "
                  )}.`
                ),
              ],
            });

            return;
          }

          await fileMessage.react("<a:loading:1307372332360138802>");

          attachment = fileAttachment;
        } catch (error) {
          console.log(
            "Error getting file attachment - model maker submission",
            error
          );
        }
      }

      try {
        const modelMakerSetup = await prisma.modelMakerSetup.findUnique({
          where: { guildId: interaction.guildId },
        });

        if (!modelMakerSetup?.logChannel) {
          await dmChannel.send(
            "Error submitting the model submission, please retry again!"
          );

          return;
        }

        const logChannel = await interaction.guild?.channels.fetch(
          modelMakerSetup.logChannel
        );

        const logEmbed = createModelMakerEmbed(interaction.user, submission);

        const acceptButton = new ButtonBuilder()
          .setLabel("Accept")
          .setCustomId(`accept-model-${id}`)
          .setStyle(ButtonStyle.Success);

        const rejectButton = new ButtonBuilder()
          .setLabel("Reject")
          .setCustomId(`reject-model-${id}`)
          .setStyle(ButtonStyle.Danger);

        const row =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            acceptButton,
            rejectButton
          );

        if (logChannel && logChannel.isTextBased()) {
          if (!attachment) {
            await logChannel.send({
              embeds: [logEmbed],
              components: [row],
            });
          } else {
            await logChannel.send({
              embeds: [logEmbed],
              files: [attachment as Attachment],
              components: [row],
            });
          }

          await prisma.modelMakerSubmission.update({
            where: { id },
            data: { submitted: true },
          });

          await dmChannel.send("Thanks for your submission! :blush:");
        }
      } catch (error) {
        console.log("Error logging submission in the channel", error);
      }
    } catch (error) {
      console.log("Error submitting model maker submission", error);
    }
  },
} as ModalSubmitExecute;
