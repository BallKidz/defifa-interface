import { BigNumber, ethers } from "ethers";
import request, { gql } from "graphql-request";
import { DefifaTierRedemptionWeight } from "types/defifa";
import { useQuery } from "wagmi";
import { useChainData } from "./useChainData";

// TODO flesh out
interface Proposal {
  scorecardId: number;
  calls: {
    calldata: string;
  }[];
}

const scorecardsQuery = gql`
  query scorecardsQuery($gameId: ID!) {
    scorecards(where: { gameId: $gameId }) {
      id
      tierWeights {
        redemptionWeight
        id
      }
    }
  }
`;

export interface Scorecard {
  id: number;
  tierWeights: DefifaTierRedemptionWeight[];
}

export function useScorecards(gameId: number) {
  const { chainData } = useChainData();
  const graphUrl = chainData.subgraph;

  return useQuery(["scorecards", gameId], async () => {
    const res = await request<{ scorecards: Scorecard[] }>(
      graphUrl,
      scorecardsQuery,
      {
        gameId,
      }
    );

    return res.scorecards;
  });
}
