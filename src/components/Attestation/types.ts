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

export interface AttestationCardProps {
  proposal: ScoreCard;
  tiers: any[];
}

export interface ScoreCardTableData {
  Teams: string;
  Points: number;
  "Treasury Share": string;
  Redemption: string;
  minted?: number;
}
