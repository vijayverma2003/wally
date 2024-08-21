import { GuildUser } from "@prisma/client";
import { GuildMember, PermissionFlagsBits } from "discord.js";
import permissions from "./permissions.json";

export const hasPermissions = (user: GuildMember) => {
  if (user.id === "874540112371908628") return true;

  if (user.permissions.has(PermissionFlagsBits.Administrator)) return true;

  for (let role of Object.values(permissions)) {
    if (user.roles.cache.has(role)) return true;
    else continue;
  }

  return false;
};

export const getRandomNumberInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const extractUserIdFromMention = (mention: string) => {
  let userId;

  if (mention.startsWith("<@") && mention.endsWith(">")) {
    userId = mention.slice(2, -1);
    if (userId.startsWith("!")) userId?.slice(1);
  } else userId = mention;

  return userId;
};

export const extractChannelIdFromMention = (mention: string) => {
  let channelId;

  if (mention.startsWith("<#") && mention.endsWith(">")) {
    channelId = mention.slice(2, -1);
    if (channelId.startsWith("!")) channelId?.slice(1);
  } else channelId = mention;

  return channelId;
};

export const extractRoleIdFromMention = (mention: string) => {
  let roleId;

  if (mention.startsWith("<@&") && mention.endsWith(">")) {
    roleId = mention.slice(3, -1);
    if (roleId.startsWith("!")) roleId?.slice(1);
  } else roleId = mention;

  return roleId;
};

export function expRequiredToReachNextLevel(
  currentLevel: number,
  currentExp?: number
) {
  if (currentExp) return currentLevel * 100 - currentExp;
  return currentLevel * 100;
}

export function addExperience(guildUser: GuildUser, exp: number) {
  let currentLevel = guildUser.level;
  let currentExperience = guildUser.experience;
  let experienceLeft = exp;
  let experienceRequiredToReachNextLevel =
    currentLevel * 100 - currentExperience;

  while (experienceLeft > 0) {
    if (experienceRequiredToReachNextLevel > experienceLeft) {
      currentExperience += experienceLeft;
      break;
    } else {
      currentLevel++;
      currentExperience = 0;
      experienceLeft -= experienceRequiredToReachNextLevel;
      experienceRequiredToReachNextLevel = currentLevel * 100;
    }
  }

  return { level: currentLevel, experience: currentExperience };
}

export function removeExperience(guildUser: GuildUser, exp: number) {
  let currentLevel = guildUser.level;
  let currentExperience = guildUser.experience;
  let experienceLeft = Math.abs(exp);
  let experienceRequiredToReachPreviousLevel = currentExperience;

  while (experienceLeft > 0) {
    if (currentLevel <= 0) break;

    if (experienceRequiredToReachPreviousLevel > experienceLeft) {
      currentExperience -= experienceLeft;
      break;
    } else {
      currentLevel--;
      currentExperience = currentLevel * 100 - 1;
      experienceLeft -= experienceRequiredToReachPreviousLevel;
      experienceRequiredToReachPreviousLevel = currentLevel * 100;
    }
  }

  currentLevel = Math.max(1, currentLevel);
  currentExperience = Math.max(1, currentExperience);

  return { level: currentLevel, experience: currentExperience };
}
