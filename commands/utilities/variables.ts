import { Message } from "discord.js";
import variablesEmbed from "../../embeds/variables";
import { hasPermissions } from "../../services/utils";

module.exports = {
  name: "variables",
  async execute(message: Message) {
    try {
      const member = await message.guild?.members.fetch(message.author.id);
      if (!member) return;

      if (!hasPermissions(member)) return;

      await message.channel.send({ embeds: [variablesEmbed()] });
    } catch (error) {
      console.log("Error while executing variables command", error);
    }
  },
};
