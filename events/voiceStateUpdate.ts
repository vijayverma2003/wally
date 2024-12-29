import { Client, Events, VoiceState } from "discord.js";
import { scanAndCreateGuilds } from "../services/guild";

module.exports = {
  name: Events.VoiceStateUpdate,
  once: true,
  async execute(client: Client, oldState: VoiceState, newState: VoiceState) {
    try {
      console.log(oldState, newState);
    } catch (error) {
      console.log("Error - Voice State Update", error);
    }
  },
};
