import { ActivityType, Client, Events, Presence } from "discord.js";
import { scanAndCreateGuilds } from "../services/guild";
import { prisma } from "../prisma/client";

module.exports = {
  name: Events.PresenceUpdate,
  async execute(client: Client, oldPresence: Presence, newPresence: Presence) {
    try {
      if (!newPresence || !newPresence.user) return;

      const status = newPresence.activities.find(
        (activity) => activity.type === ActivityType.Custom
      );

      const vanityURLs = await prisma.guildVanity.findMany();

      if (status) {
        for (let vanity of vanityURLs) {
          const guild = await prisma.guild.findUnique({
            where: { guildId: vanity.guildId },
          });

          if (!guild) return;

          if (guild?.vanityRole) {
            const server = await client.guilds.fetch(guild.guildId);
            const member = await server.members.fetch(newPresence.userId);
            if (!member) return;

            if (status.state?.toLowerCase().includes(vanity.vanityURL)) {
              if (!member.roles.cache.has(guild.vanityRole)) {
                await member.roles.add(guild.vanityRole);
                console.log("Adding vanity role for ", member.user.displayName);
              }
            } else {
              if (member.roles.cache.has(guild.vanityRole)) {
                await member.roles.remove(guild.vanityRole);
                console.log(
                  "Removing vanity role from ",
                  member.user.displayName
                );
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.code === 10007) {
        console.log("Member not found (Unknown Member error)");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  },
};
