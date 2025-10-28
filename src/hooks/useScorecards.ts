import request, { gql } from "graphql-request";
import { DefifaTierRedemptionWeight } from "types/defifa";
import { useQuery } from "@tanstack/react-query";
import { useChainData } from "./useChainData";

const scorecardsQuery = gql`
  query scorecardsQuery($gameId: ID!) {
    scorecards(where: { gameId: $gameId }) {
      id
      scorecardId
      tierWeights {
        redemptionWeight
        tierId
        id
      }
      submitter {
        id
      }
    }
  }
`;

export interface Scorecard {
  id: string; // Full composite ID from subgraph (e.g., "51-40370395596270660893060605039195820391083727257390537490197793639000751539431")
  scorecardId: bigint; // BigInt scorecard ID for contract calls
  tierWeights: DefifaTierRedemptionWeight[];
  submitter: {
    id: string; // address
  };
}

export function useScorecards(gameId: number) {
  const { chainData } = useChainData();
  const graphUrl = chainData.subgraph;

  return useQuery({
    queryKey: ["scorecards", gameId, "v1.0.1"],
    queryFn: async () => {
      const res = await request<{ scorecards: any[] }>(
        graphUrl,
        scorecardsQuery,
        {
          gameId,
        }
      );

      // Convert scorecardId from string to number (GraphQL BigInt returns as string)
      const convertedScorecards = res.scorecards.map(scorecard => ({
        ...scorecard,
        scorecardId: BigInt(scorecard.scorecardId)
      }));
      return convertedScorecards;
    },
    refetchInterval: 5 * 1000, // Simple 5-second polling
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider data stale
  });
}
