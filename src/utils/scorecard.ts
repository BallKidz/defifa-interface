interface ScoreCard {
  id: number;
  redemptionWeight: number;
}

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
