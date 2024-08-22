import { Guild, GuildUser, LevelRole } from "@prisma/client";
import emojis from "./emojis";
import { replacePlaceHolders } from "./placeholder";

export const createProgressBar = (totalExp: number, currentExp: number) => {
  const progressPercentage = (currentExp * 100) / totalExp;
  const progressBarLength = 12;
  const filledBarLength = Math.floor(
    progressBarLength * (progressPercentage / 100)
  );

  let progressBar = ``;

  for (let i = 0; i < progressBarLength; i++) {
    if (i < filledBarLength) {
      if (i === 0) progressBar += emojis.barStart;
      else if (i === progressBarLength - 1) progressBar += emojis.barEnd;
      else progressBar += emojis.barMid;
    } else {
      if (i === 0) progressBar += emojis.unfilledBarStart;
      else if (i === progressBarLength - 1)
        progressBar += emojis.unfilledBarEnd;
      else progressBar += emojis.unfilledBarMid;
    }
  }

  return { progressBar, progressPercentage };
};

export const levelUpMessage = (
  user: GuildUser,
  guild: Guild,
  levelRole: LevelRole | null
) => {
  const placeHolderArgs = {
    level: user.level + 1,

    userId: `<@${user.id}>`,
  };

  return levelRole && guild.levelRoleMessage
    ? replacePlaceHolders(guild.levelRoleMessage, {
        ...placeHolderArgs,
        roleId: `<@&${levelRole.roleId}>`,
      })
    : guild.levelUpMessage
    ? replacePlaceHolders(guild.levelUpMessage, placeHolderArgs)
    : `Congratulations <@${user.id}>, you reached level ${user.level + 1}!`;
};

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
