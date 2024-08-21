import emojis from "./emojis";

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
