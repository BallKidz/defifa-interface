import { convertPercentsToPoints } from "../../../../utils/scorecard";
import { ScoreCard, ScoreCardTableData } from "../../types";

export const getScoreCardTableData = (tiers: any[], proposal: ScoreCard) => {
  return proposal.scoreCard.tierWeights
    .filter((tw) => tiers.some((t) => t.id === tw.id))
    .map((tw) => {
      const team = tiers.find((t) => t.id === tw.id) || {};
      const { teamName = "", minted } = team;
      return {
        Teams: teamName,
        Points: convertPercentsToPoints(tw.redemptionWeight),
        "Treasury Share": "",
        Redemption: "0",
        minted,
      };
    });
};

export const calculateTotalRedemption = (
  scoreCardTableData: ScoreCardTableData[]
) => {
  return scoreCardTableData.reduce((sum, obj) => sum + obj.Points, 0);
};

export const updateRedemptionAndShare = (
  obj: ScoreCardTableData,
  totalPot: number,
  totalRedemption: number
) => {
  const { Points, minted } = obj;
  if (Points !== 0 && minted) {
    obj["Treasury Share"] = `${((Points / totalRedemption) * 100).toFixed(2)}%`;
    obj.Redemption = `Ξ${(
      (totalPot * (Points / totalRedemption)) /
      minted
    ).toFixed(5)} per token`;
  }
};
