import { Interaction } from "discord.js";
import { DiscordClient } from "../../types/main";
import acceptionMessageSubmission from "./acception-message-submission";
import eventSubmission from "./event-submission";
import modelMakerConfigurationSubmission from "./model-maker-configuration-submission";
import modelMakerSubmission from "./model-maker-submission";
import rejectionMessageSubmission from "./rejection-message-submission";
import submissionSetupModal from "./submission-setup-modal";

export interface ModalSubmitExecute {
  startsWith?: string;
  customId?: string;
  execute: (client: DiscordClient, interaction: Interaction) => void;
}

const modals: ModalSubmitExecute[] = [
  acceptionMessageSubmission,
  eventSubmission,
  modelMakerConfigurationSubmission,
  modelMakerSubmission,
  rejectionMessageSubmission,
  submissionSetupModal,
];

export default modals;
