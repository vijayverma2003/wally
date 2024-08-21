import { Message } from "discord.js";
import helpEmbed from "../../embeds/help";

module.exports = {
  name: "help",
  async execute(message: Message) {
    try {
      await message.channel.send({ embeds: [helpEmbed(true)] });
    } catch (error) {
      console.log("Error while executing help command", error);
    }
  },
};
