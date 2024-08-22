import { Client, Collection, Message } from "discord.js";

export interface DiscordClient extends Client {
  commands?: Collection<string, TextCommand>;
}

export interface TextCommand {
  name: string;
  execute: (message: Message, args: string[], content: string) => void;
}
