import { Interaction } from "discord.js";
import { DiscordClient } from "../../types/main";
import helpInteraction from "./help-interaction";
import technologySelector from "./technology-selector";
import extractionSelector from "./extraction-selector";

export interface SelectMenuExecute {
  startsWith?: string;
  customId?: string;
  execute: (client: DiscordClient, interaction: Interaction) => void;
}

const selectMenus: SelectMenuExecute[] = [
  helpInteraction,
  technologySelector,
  extractionSelector,
];

export default selectMenus;
