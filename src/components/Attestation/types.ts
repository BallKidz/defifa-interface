export interface ScoreCard {
  title: string;
  scoreCard: {
    proposalId: number;
    tierWeights: {
      id: number;
      redemptionWeight: number;
    }[];
  };
  isEqual?: boolean;
}
