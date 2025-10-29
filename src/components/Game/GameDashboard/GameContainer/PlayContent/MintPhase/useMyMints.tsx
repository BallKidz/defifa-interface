import { useGameContext } from "contexts/GameContext";
import { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { requestWithAuth } from "lib/graphql";

const query = gql`
  query myMintsQuery($owner: String!, $gameId: String!) {
    contracts(where: { gameId: $gameId }) {
      mintedTokens(where: { owner: $owner }) {
        id
        number
        metadata {
          description
          id
          identifier
          image
          name
          tags
        }
      }
    }
  }
`;

export function useMyMints() {
  const {
    chainData: { subgraph },
  } = useChainData();
  const { address } = useAccount();
  const { gameId } = useGameContext();

  return useQuery({
    queryKey: ["picks", address, gameId],
    queryFn: () => {
      return requestWithAuth<{
        contracts: {
          mintedTokens: {
            number: string;
          }[];
        }[];
      }>(subgraph, query, {
        owner: address?.toLowerCase(),
        gameId: gameId.toString(),
      });
    },
    enabled: !!address,
    // Simple 5-second polling - no complex caching
    refetchInterval: 5 * 1000, // 5 seconds
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider data stale
  });
}
