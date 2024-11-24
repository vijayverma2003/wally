import { Message } from "discord.js";

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

export function getFormattedDate(date?: Date) {
  if (!date) date = new Date();

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    formatMatcher: "basic",
  }).formatToParts(date);

  return `${formattedDate[4].value}-${formattedDate[2].value}-${formattedDate[0].value}`;
}

export function parseFormattedDate(formattedDate: string) {
  if (!/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/.test(formattedDate))
    return undefined;

  const [day, month, year] = formattedDate.split("-").map(Number);

  if (day && month && year) return new Date(day, month - 1, year);
  return undefined;
}

export function isValidDateFormat(date: string) {
  return /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/.test(date);
}

export async function getTagValues(message: Message, validTags: string[]) {
  const values: { [tag: string]: string } = {};

  const getTags = (str: string, arr: string[] = []) => {
    const index = str.indexOf("--");
    if (index < 0) return arr;

    const endIndex = str.indexOf(" ", index);
    const slicedTag = str.slice(index, endIndex < 0 ? undefined : endIndex);
    arr.push(slicedTag);

    return getTags(str.slice(index + slicedTag.length), arr);
  };

  const tags = getTags(message.content);

  for (let i = 0; i < tags.length; i++) {
    if (!validTags.includes(tags[i]))
      return { error: `Invalid ${tags[i]} :confused:` };

    const index = message.content.indexOf(tags[i]);
    const nextTagIndex = message.content.indexOf(tags[i + 1]);
    const value = message.content
      .slice(
        index + tags[i].length + 1,
        nextTagIndex < 0 ? undefined : nextTagIndex
      )
      .trim();

    if (!value)
      return {
        error: `No value was provided for \`${tags[i]}\` :sweat_smile:`,
      };

    values[tags[i]] = value.trim();
  }

  return values;
}
