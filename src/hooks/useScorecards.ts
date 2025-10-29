import { gql } from "graphql-request";
import { DefifaTierRedemptionWeight } from "types/defifa";
import { useQuery } from "@tanstack/react-query";
import { useChainData } from "./useChainData";
import { requestWithAuth } from "lib/graphql";

const scorecardsQuery = gql`
  query scorecardsQuery($gameId: ID!) {
    scorecards(first: 40, where: { gameId: $gameId }) {
      id
      gameId
      scorecardId
      submitter {
        id
      }
      tierWeights {
        id
        tierId
        redemptionWeight
      }
    }
  }
`;

export interface Scorecard {
  id?: string; // Full composite ID from subgraph (e.g., "51-40370395596270660893060605039195820391083727257390537490197793639000751539431")
  gameId: string;
  scorecardId?: bigint; // BigInt scorecard ID for contract calls
  tierWeights: DefifaTierRedemptionWeight[];
  submitter?: {
    id: string; // address
  };
}

export function useScorecards(gameId: number) {
  const { chainData } = useChainData();
  const graphUrl = chainData.subgraph;
  
  console.log(`[useScorecards] Hook called with gameId: ${gameId} (type: ${typeof gameId})`);
  console.log(`[useScorecards] Chain data:`, chainData);

  return useQuery({
    queryKey: ["scorecards", gameId],
    queryFn: async () => {
      console.log(`[useScorecards] Fetching scorecards for gameId: ${gameId}`);
      
      const res = await requestWithAuth<{ scorecards: any[] }>(
        graphUrl,
        scorecardsQuery,
        {
          gameId: gameId.toString(),
        }
      );

      console.log(`[useScorecards] Raw scorecards response:`, res.scorecards);

      // Convert scorecardId from string to BigInt (GraphQL BigInt returns as string)
      const convertedScorecards = res.scorecards.map(scorecard => ({
        ...scorecard,
        scorecardId: scorecard.scorecardId ? BigInt(scorecard.scorecardId) : undefined
      })) as Scorecard[];
      
      console.log(`[useScorecards] Converted scorecards:`, convertedScorecards);
      
      return convertedScorecards;
    },
    refetchInterval: 30 * 1000, // Reduced to 30-second polling to avoid rate limits
    refetchIntervalInBackground: false, // Don't poll in background to reduce RPC calls
    staleTime: 10 * 1000, // Consider data fresh for 10 seconds
  });
}
