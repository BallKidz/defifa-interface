import { gql } from "graphql-request";
import { requestWithAuth } from "lib/graphql";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";

export function useGameTopHolders(gameId: string) {
  const {
    chainData: { subgraph },
  } = useChainData();

  const query = gql`
    query gameTopHoldersQuery($gameId: String!) {
      contracts(where: { gameId: $gameId }) {
        gameId
        name
        mintedTokens {
          id
          owner {
            id balance
          }
        }
      }
    }
  `;

  return useQuery({
    queryKey: ["gameTopHolders", gameId],
    queryFn: () => {
      return requestWithAuth(subgraph, query, { gameId });
    },
  });
}
