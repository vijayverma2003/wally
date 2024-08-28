export const settings = "<:settings:1271053403816198217>";
export const roles = "<:roles:1271053390121537587>";
export const ranking = "<:ranking:1271053375978602590>";
export const levelup = "<:levelup:1271053362879533162>";
export const leaderboard = "<:leaderboard:1271053345359921194>";
export const help = "<:help:1271053335050457088>";

interface Emojis {
  whiteArrow: string;
  blueArrow: string;
  exp: string;
  help: string;
  leaderboard: string;
  levelup: string;
  ranking: string;
  level: string;
  loading: string;
  roles: string;
  settings: string;
  user: string;
  star: string;
  barStart: string;
  barMid: string;
  barEnd: string;
  unfilledBarStart: string;
  unfilledBarMid: string;
  unfilledBarEnd: string;
}

const developmentEmojis: Emojis = {
  settings: "<:settings:1271053403816198217>",
  roles: "<:roles:1271070087620857968>",
  levelup: "<:levelup:1271053362879533162>",
  leaderboard: "<:leaderboard:1278307221373190164>",
  help: "<:help:1271347266250346567>",
  whiteArrow: "<:arrow:1271068548130668637>",
  blueArrow: "<:arrows:1271066698400661614>",
  user: "<:user:1271066292186513582>",
  star: "<:star:1271064480754962502>",
  exp: "<:exp:1271062715737313386>",
  ranking: "<:ranking:1271062464410292265>",
  level: "<:level:1271061421752324116>",
  loading: "<a:loading:1275734140628766773>",
  barStart: "<:barstart:1269577164278202439>",
  barMid: "<:barmid:1269577151762665473>",
  barEnd: "<:barend:1269577137875062814>",
  unfilledBarStart: "<:unfilledbarstart:1269577756451143720>",
  unfilledBarMid: "<:unfilledbarmid:1269577743818031116>",
  unfilledBarEnd: "<:unfilledbarend:1269577729431310417>",
};

const productionEmojis: Emojis = {
  whiteArrow: "<:arrow:1275727558352310327>",
  blueArrow: "<:arrows:1275727586114404444>",
  exp: "<:exp:1275727614215983226>",
  help: "<:help:1275727641105797150>",
  leaderboard: "<:leaderboard:1275727654204477441>",
  levelup: "<:levelup:1275727667626508369>",
  ranking: "<:ranking:1275727714317504512>",
  level: "<:level:1275727683602481196>",
  loading: "<a:loading:1275727700023054346>",
  roles: "<:roles:1275727727865106453>",
  settings: "<:settings:1275727746554789920>",
  user: "<:user:1275727771871739936>",
  star: "<:star:1275727783430983711>",
  barStart: "<:barstart:1275733219441901659>",
  barMid: "<:barmid:1275733231479816233>",
  barEnd: "<:barend:1275733245320888421>",
  unfilledBarStart: "<:unfilledbarstart:1275733191960957000>",
  unfilledBarMid: "<:unfilledbarmid:1275733205181272074>",
  unfilledBarEnd: "<:unfilledbarend:1275733172302250005>",
};

export default process.env.NODE_ENV === "development"
  ? developmentEmojis
  : productionEmojis;
