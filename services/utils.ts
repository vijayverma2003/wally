export function isValidColor(color: string | null) {
  if (!color) return false;
  return /^#[0-9A-F]{6}$/i.test(color);
}

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
