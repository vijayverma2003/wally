import { Client, Collection, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import ms from "ms";
import fs from "node:fs";
import path from "node:path";
import { scanTempRoles } from "./services/roles";
import { DiscordClient } from "./types/main";
import { clearSubmissions } from "./services/model-submissions";

config();

export const prefix = "!";

export const client: DiscordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection<string, any>();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath);

for (let file of eventFiles) {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    const filePath = path.join(eventsPath, file);

    const event = require(filePath);

    if (!("name" in event) || !("execute" in event)) {
      console.log(
        `[WARNING] - Name property or execute method is missing in the event.`
      );

      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else client.on(event.name, (...args) => event.execute(client, ...args));
  } else continue;
}

const commandsFolderPath = path.join(__dirname, "commands");
const commandsFolder = fs.readdirSync(commandsFolderPath);

for (let folder of commandsFolder) {
  const commandFilesPath = path.join(commandsFolderPath, folder);
  const commandFiles = fs.readdirSync(commandFilesPath);

  for (let file of commandFiles) {
    const commandPath = path.join(commandFilesPath, file);
    const command = require(commandPath);

    if ("name" in command || "execute" in command) {
      client.commands.set(command.name, command);
      continue;
    } else {
      console.log(
        `[WARNING] - Data property or execute method is missing in the command.`
      );
    }
  }
}

process.on("unhandledRejection", async (error: any) => {
  try {
    await client.users.cache
      .get("874540112371908628")
      ?.send(`Unhandled Rejection [unhandledRejection] \`\`\`${error}\`\`\``);
  } catch (error) {
    console.log("Unhandled Rejection - ", error);
  }
});

process.on("uncaughtException", async (error) => {
  try {
    await client.users.cache
      .get("874540112371908628")
      ?.send(`Unhandled Rejection [uncaughtException] \`\`\`${error}\`\`\``);
  } catch (error) {
    console.log("Uncaught Exception - ", error);
  }
});

process.on("uncaughtExceptionMonitor", async (error, origin) => {
  try {
    await client.users.cache
      .get("874540112371908628")
      ?.send(
        `Unhandled Rejection [uncaughtExceptionMonitor] \`\`\`${error}\`\`\`\n\`\`\`${origin}\`\`\``
      );
  } catch (error) {
    console.log("Uncaught Exception Monitor - ", error, origin);
  }
});

client.login(process.env.DISCORD_TOKEN!).catch(console.error);

setInterval(scanTempRoles, ms("1 minute"));
setInterval(clearSubmissions, ms("10 minutes"));
