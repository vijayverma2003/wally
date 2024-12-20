import { Events, Message } from "discord.js";
import { prefix } from "../";
import { DiscordClient } from "../types/main";
import addExperience from "./messages/add-experience";
import liveMessageCount from "./messages/live-message-count";
import trackActivity from "./messages/track-activity";
import liveLeaderboard from "./messages/live-leaderboard";

module.exports = {
  name: Events.MessageCreate,
  async execute(client: DiscordClient, message: Message) {
    if (message.channel.isDMBased() || message.author.bot || !message.guild)
      return;

    liveMessageCount(message);
    addExperience(message);
    trackActivity(message);
    liveLeaderboard(message);

    // Text Commands Execution

    try {
      if (message.content.toLowerCase().startsWith(prefix)) {
        let content = message.content.slice(prefix.length).trim();
        const args = content.split(/ +/);
        if (args.length === 0) return;

        const commandName = args.shift();
        if (!commandName) return;

        const command = client.commands?.get(commandName.toLowerCase());

        if (!command || !("execute" in command)) return;

        try {
          content = content.slice(command.name.length);
          command.execute(message, args, content);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log("Error while starting text command execution", error);
    }
  },
};
