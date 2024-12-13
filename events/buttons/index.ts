import { Interaction } from "discord.js";
import { DiscordClient } from "../../types/main";
import acceptModel from "./accept-model";
import eventSubmission from "./event-submission";
import modelMakerConfiguration from "./model-maker-conf-modal";
import modelMakerSubmissionSelectors from "./model-maker-submission-selectors";
import newSubmissionSetup from "./new-event-submission-setup";
import rejectModel from "./reject-model";
import modelMakerSubmissionModal from "./model-maker-submission-modal";
import cancelModelMakerSubmission from "./cancel-model-maker-submission";

export interface ButtonExecute {
  startsWith?: string;
  customId?: string;
  execute: (client: DiscordClient, interaction: Interaction) => void;
}

const buttons: ButtonExecute[] = [
  acceptModel,
  rejectModel,
  modelMakerConfiguration,
  eventSubmission,
  modelMakerSubmissionSelectors,
  newSubmissionSetup,
  modelMakerSubmissionModal,
  cancelModelMakerSubmission,
];

export default buttons;
