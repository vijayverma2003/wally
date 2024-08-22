import { Guild, GuildMember, PermissionFlagsBits } from "discord.js";
import permissions from "./permissions.json";

export const assignRole = async (
  guild: Guild,
  userId: string,
  roleId: string
) => {
  try {
    const role = await guild?.roles.fetch(roleId);
    if (!role) return;

    const member = await guild?.members.fetch(userId);

    if (member) await member.roles.add(role);
  } catch (error) {
    console.log("Error while assigning role to a member", error);
  }
};

export const hasPermissions = (user: GuildMember) => {
  if (user.id === "874540112371908628") return true;

  if (user.permissions.has(PermissionFlagsBits.Administrator)) return true;

  for (let role of Object.values(permissions)) {
    if (user.roles.cache.has(role)) return true;
    else continue;
  }

  return false;
};
