import { Client, Events } from "discord.js";
import { scanAndCreateGuilds } from "../services/guild";

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    try {
      scanAndCreateGuilds(client);
      console.log(`Logged in as ${client.user?.displayName} successfully! ♥️`);
    } catch (error) {
      console.log("Error - Client Ready", error);
    }
  },
};
