import moment from "moment";
import { prisma } from "../prisma/client";
import { Prisma } from "@prisma/client";
import { EmbedBuilder } from "@discordjs/builders";
import { client } from "..";

export async function logStaffActivity() {
  try {
    const startOfTheWeek = moment().startOf("isoWeek");

    const staffActivity = await prisma.staffActivity.findMany({
      where: { date: { gte: startOfTheWeek.format("YYYY-MM-DD") } },
    });

    const sortedActivity = staffActivity.sort(
      (a, b) => b.messageCount - a.messageCount
    );

    const staffData: {
      [user: string]: {
        messages: number;
        guildId: string;
        bans: number;
        kicks: number;
        mutes: number;
        activeChannels: { [channelId: string]: number };
      };
    } = {};

    for (let staffActivity of sortedActivity) {
      let data = staffData[staffActivity.userId];
      if (!data)
        data = {
          guildId: "",
          messages: 0,
          bans: 0,
          kicks: 0,
          mutes: 0,
          activeChannels: {},
        };

      data.guildId = staffActivity.guildId;

      data.messages = data.messages
        ? data.messages + staffActivity.messageCount
        : staffActivity.messageCount;

      data.bans = data ? data.bans + staffActivity.bans : staffActivity.bans;

      data.kicks = data
        ? data.kicks + staffActivity.kicks
        : staffActivity.kicks;

      data.mutes = data
        ? data.mutes + staffActivity.mutes
        : staffActivity.mutes;

      if (staffActivity.activity) {
        const parsedChannelActivity =
          staffActivity.activity as Prisma.JsonObject;

        for (let channelActivity in parsedChannelActivity) {
          const channelMessageCount = data.activeChannels[channelActivity];

          if (!channelMessageCount)
            data.activeChannels[channelActivity] = parsedChannelActivity[
              channelActivity
            ] as number;
          else
            data.activeChannels[channelActivity] =
              (parsedChannelActivity[channelActivity] as number) +
              channelMessageCount;
        }
      }

      staffData[staffActivity.userId] = data;
    }

    const logChannel = await client.channels.fetch("1310223567346204712");

    for (let user in staffData) {
      try {
        const data = staffData[user];

        const guild = client.guilds.cache.get(data.guildId);
        const member = await guild?.members.fetch(user);

        const mappedChannelData = Object.keys(data.activeChannels)
          .sort((a, b) => data.activeChannels[b] - data.activeChannels[a])
          .slice(0, 5)
          .map(
            (channel, index) =>
              `${index + 1}. <#${channel}> - ${data.activeChannels[channel]}`
          )
          .join("\n");

        const embed = new EmbedBuilder()
          .setTitle("Staff Activity")
          .setColor(
            data.messages > 0
              ? data.messages > 500
                ? 0x3d3bf3
                : 0x9694ff
              : 0xff2929
          )
          .setDescription(
            `
  **User** - <@${user}> (${user})
  **Total Messages Sent** - ${data.messages}
  **Total Actions Taken** - ${data.bans + data.kicks + data.mutes} (${
              data.bans
            } Bans, ${data.kicks} Kicks and ${data.mutes} Mutes)
  
  **Top 5 Channels Data** 
  
  ${
    mappedChannelData
      ? mappedChannelData
      : "No Activity <:RedDot:1310546353859858513>"
  }
  `
          )
          .setImage(
            "https://cdn.discordapp.com/attachments/932319557853532172/1056987846591922256/7qnJwbX.png?ex=67455d64&is=67440be4&hm=506aefcd0518e404e62d09b4bb7d460b2c70a401535e646467a58fc697dc365f&"
          );

        if (member) {
          embed.setAuthor({
            iconURL: member.displayAvatarURL(),
            name: member.displayName,
          });

          embed.setThumbnail(member.displayAvatarURL());
        }

        if (logChannel?.isTextBased())
          await logChannel.send({ embeds: [embed] });
      } catch (error) {
        console.log("Logging Activity in Logs Channel", error);
      }
    }

    try {
      const staffMembers = await prisma.guildUser.findMany({
        where: { isStaff: true },
      });

      const inactiveStaff = staffMembers
        .filter((member) => !Object.keys(staffData).includes(member.userId))
        .map(
          (staff, index) => `${index + 1}. <@${staff.userId}> (${staff.userId})`
        )
        .join("\n");

      if (inactiveStaff.length > 0) {
        const embed = new EmbedBuilder()
          .setTitle("List of Inactive Staff Members")
          .setDescription(inactiveStaff)
          .setColor(0xff2929)
          .setImage(
            "https://cdn.discordapp.com/attachments/932319557853532172/1056987846591922256/7qnJwbX.png?ex=67455d64&is=67440be4&hm=506aefcd0518e404e62d09b4bb7d460b2c70a401535e646467a58fc697dc365f&"
          );

        if (logChannel?.isTextBased())
          await logChannel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.log("Error sending non-active staff members", error);
    }
  } catch (error) {
    console.log("log activity - ", error);
  }
}
