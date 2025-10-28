import request, { gql } from "graphql-request";
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
      return request(subgraph, query, { gameId });
    },
  });
}
