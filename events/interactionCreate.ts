import { Events, Interaction } from "discord.js";
import { DiscordClient } from "../types/main";
import buttons from "./buttons";
import modals from "./modals";
import selectMenus from "./select-menu";

module.exports = {
  name: Events.InteractionCreate,
  async execute(client: DiscordClient, interaction: Interaction) {
    try {
      if (!interaction.guildId) return;
      console.log(interaction.type);
      if (interaction.isButton()) {
        console.log(interaction.customId);
        for (let button of buttons) {
          if (
            button.startsWith &&
            interaction.customId.startsWith(button.startsWith)
          ) {
            console.log("if");
            button.execute(client, interaction);
            break;
          } else if (
            button.customId &&
            interaction.customId === button.customId
          ) {
            console.log("else if");
            button.execute(client, interaction);
            break;
          }
        }
      } else if (interaction.isModalSubmit()) {
        for (let modal of modals) {
          if (
            modal.startsWith &&
            interaction.customId.startsWith(modal.startsWith)
          ) {
            modal.execute(client, interaction);
            break;
          } else if (
            modal.customId &&
            interaction.customId === modal.customId
          ) {
            modal.execute(client, interaction);
            break;
          }
        }
      } else if (interaction.isAnySelectMenu()) {
        for (let selectMenu of selectMenus) {
          if (
            selectMenu.startsWith &&
            interaction.customId.startsWith(selectMenu.startsWith)
          ) {
            selectMenu.execute(client, interaction);
            break;
          } else if (
            selectMenu.customId &&
            interaction.customId === selectMenu.customId
          ) {
            selectMenu.execute(client, interaction);
            break;
          }
        }
      }
    } catch (error) {
      console.log("Error - InteractionCreate", error);
    }
  },
};
