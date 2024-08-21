import { Message } from "discord.js";

module.exports = {
  name: "ping",
  async execute(message: Message) {
    try {
      await message.channel.send("Pong!");
    } catch (error) {
      console.log("Error while executing ping command", error);
    }
  },
};
