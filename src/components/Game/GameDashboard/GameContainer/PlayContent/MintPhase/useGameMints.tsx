import request, { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";

const query = gql`
  query gameMintsQuery($gameId: String!) {
    contracts(where: { gameId: $gameId }) {
      mintedTokens(where: { owner_not: "0x0000000000000000000000000000000000000000" }) {
        id
        number
        owner {
          id
        }
      }
    }
  }
`;

export function useGameMints(gameId: number) {
  const {
    chainData: { subgraph },
  } = useChainData();

  return useQuery({
    queryKey: ["game-mints", gameId],
    queryFn: async () => {
      const res: { contracts?: { mintedTokens?: any[] }[] } = await request(subgraph, query, {
        gameId: gameId.toString(),
      });

      return res?.contracts?.[0]?.mintedTokens || [];
    },
    enabled: !!gameId,
    // Simple 5-second polling - no complex caching
    refetchInterval: 5 * 1000, // 5 seconds
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider data stale
  });
}
