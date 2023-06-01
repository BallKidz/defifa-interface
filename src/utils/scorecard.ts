import { ONE_BILLION } from "hooks/NftRewards";

interface ScoreCard {
  id: number;
  redemptionWeight: number;
}

const totalPoints = 100000;

export const convertScoreCardToPercents = (scoreCard: ScoreCard[]) => {
  const scoreCardWithPercents = scoreCard.map((obj) => {
    const newObj = { ...obj };
    newObj.redemptionWeight = Math.floor(
      (newObj.redemptionWeight / totalPoints) * ONE_BILLION
    );

    return newObj;
  });

  return scoreCardWithPercents;
};

export const convertPercentsToPoints = (percentages: number | undefined) => {
  if (!percentages) return 0; // return 0 if the percentages parameter is undefined
  const weight = Math.round((percentages * totalPoints) / ONE_BILLION);

  return weight;
};
