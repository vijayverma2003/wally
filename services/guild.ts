import { Client, EmbedBuilder, ThreadAutoArchiveDuration } from "discord.js";
import { prisma } from "../prisma/client";
import { GuildUser, LiveLeaderboardPrizes } from "@prisma/client";
import { client } from "..";
import moment from "moment";

export const scanAndCreateGuilds = async (client: Client) => {
  const guilds = await client.guilds.fetch();

  guilds.forEach(async (guild) => {
    try {
      const guildInDb = await prisma.guild.findUnique({
        where: { guildId: guild.id },
      });

      if (!guildInDb)
        await prisma.guild.create({ data: { guildId: guild.id } });
    } catch (error) {
      console.log(`[ERROR] [SCAN AND CREATE GUILDS] [${guild.name}]`, error);
    }
  });
};

export const createLeaderboard = (
  users: GuildUser[],
  prizes: LiveLeaderboardPrizes[],
  snapshot?: boolean
) => {
  let lb = [];

  for (let i = 0; i < Math.min(users.length, 10); i++) {
    const prize = prizes.find((prize) => prize.position === i + 1)?.prize;
    lb.push(
      `> ${i + 1}. <@${users[i].userId}> - **\`${
        users[i].liveLeaderboardMessageCount
      }\`** ${prize ? `~ ${prize}` : ""}`
    );
  }

  return new EmbedBuilder().setTitle(
    "<:live:1319630764869943316> Live Leaderboard"
  ).setDescription(`
   
${lb.join("\n")}

${snapshot ? "" : `-# Last updated - <t:${Math.floor(Date.now() / 1000)}:R>`}
`);
};

export const logLeaderboardResults = async (
  resetPeriod: "weekly" | "monthly"
) => {
  try {
    const endOfMonth = moment().endOf("month").get("date");
    const today = moment().get("date");

    if (resetPeriod === "monthly" && endOfMonth !== today) return;

    const guilds = await prisma.guild.findMany({
      where: { liveLeaderboardResetPeriod: resetPeriod },
    });

    for (let guild of guilds) {
      try {
        if (guild.liveLeaderboardChannelId && guild.liveLeaderboardMessageId) {
          const server = await client.guilds.fetch(guild.guildId);
          const channel = await server.channels.fetch(
            guild.liveLeaderboardChannelId
          );

          if (channel && channel.isTextBased()) {
            const message = await channel.messages.fetch(
              guild.liveLeaderboardMessageId
            );

            const users = await prisma.guildUser.findMany({
              where: { guildId: message.guild.id },
              orderBy: { liveLeaderboardMessageCount: "desc" },
              take: 10,
            });

            const prizes = await prisma.liveLeaderboardPrizes.findMany({
              where: { guildId: message.guild.id },
            });

            if (message.hasThread) {
              await message.thread?.send({
                content: `### Live Leaderboard Results - ${moment().format(
                  "DD/MM/YYYY"
                )}`,
                embeds: [createLeaderboard(users, prizes, true)],
              });
            } else {
              const thread = await message.startThread({
                name: "Leaderboard Results",
                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                reason: `Logs the results of ${resetPeriod} leaderboard`,
              });

              await thread.send({
                content: `### Live Leaderboard Results - ${moment().format(
                  "DD/MM/YYYY"
                )}`,
                embeds: [createLeaderboard(users, prizes, true)],
              });
            }
          }
        }

        await prisma.guildUser.updateMany({
          where: { guildId: guild.guildId },
          data: { liveLeaderboardMessageCount: 0 },
        });
      } catch (error) {
        console.log(
          `ERROR - Live leaderboard ${resetPeriod} logs -  ${guild.guildId}`,
          error
        );
      }
    }
  } catch (error) {
    console.log(
      `Error while logging ${resetPeriod} leaderboard results`,
      error
    );
  }
};

export async function updateLeaderboard() {
  try {
    const guilds = await prisma.guild.findMany();

    for (let guild of guilds) {
      try {
        if (guild.liveLeaderboardChannelId && guild.liveLeaderboardMessageId) {
          const server = await client.guilds.fetch(guild.guildId);
          const channel = await server.channels.fetch(
            guild.liveLeaderboardChannelId
          );

          if (channel && channel.isTextBased()) {
            const message = await channel.messages.fetch(
              guild.liveLeaderboardMessageId
            );

            const users = await prisma.guildUser.findMany({
              where: { guildId: message.guild.id },
              orderBy: { liveLeaderboardMessageCount: "desc" },
              take: 10,
            });

            const prizes = await prisma.liveLeaderboardPrizes.findMany({
              where: { guildId: message.guild.id },
            });

            if (message)
              await message.edit({
                embeds: [createLeaderboard(users, prizes)],
              });
          }
        }
      } catch (error) {
        console.log(
          `ERROR - Live leaderboard Update logs -  ${guild.guildId}`,
          error
        );
      }
    }
  } catch (error) {
    console.log("Error while updating leaderboard", error);
  }
}
