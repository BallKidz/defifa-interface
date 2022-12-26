import ScoreCard from "../components/Scorecard";

export const convertScoreCardToPercents = (scoreCard: ScoreCard[]) => {
  const totalSum = scoreCard.reduce(
    (total, obj) => total + obj.redemptionWeight,
    0
  );

  const scoreCardWithPercents = scoreCard.map((obj) => {
    const newObj = { ...obj };
    newObj.redemptionWeight = Math.floor(
      (newObj.redemptionWeight / totalSum) * 1000000000
    );

    return newObj;
  });

  return scoreCardWithPercents;
};

export const convertPercentsToPoints = (
  percentages: number | undefined,
  scoreCard: ScoreCard[]
) => {
  if (!percentages) return 0; // return 0 if the percentages parameter is undefined

  const totalSum = scoreCard.reduce(
    (total, obj) => total + obj.redemptionWeight,
    0
  ); // calculate the total sum using the redemptionWeight values of the scoreCard objects
  const weight = Math.round((percentages / 10000000000000) * totalSum); // convert the percentages to a weight using the total sum
  return weight; // return the converted weight
};
