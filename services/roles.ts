import { client } from "..";
import { prisma } from "../prisma/client";

export async function scanTempRoles() {
  try {
    const tempRoles = await prisma.tempRole.findMany();

    for (let tempRole of tempRoles) {
      try {
        const guild = await client.guilds.fetch(tempRole.guildId);
        const member = await guild.members.fetch(tempRole.userId);
        if (!member) continue;

        if (tempRole.endsAt < Date.now()) {
          await member.roles.remove(tempRole.roleId);
          await prisma.tempRole.delete({ where: { id: tempRole.id } });
        } else await member.roles.add(tempRole.roleId);
      } catch (error) {
        console.log("Error removing expired temporary roles", error);
        continue;
      }
    }
  } catch (error) {
    console.log("Error executing scanTopChatter", error);
  }
}
