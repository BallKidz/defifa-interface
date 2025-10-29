import { gql } from "graphql-request";
import { requestWithAuth } from "lib/graphql";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";

const query = gql`
  query topPlayersQuery {
    owners {
      id
      ownedTokens {
        gameId
      }
    }
  }
`;

export function useTopPlayers() {
  const {
    chainData: { subgraph },
  } = useChainData();

  return useQuery({
    queryKey: ["topPlayers"],
    queryFn: () => {
      return requestWithAuth(subgraph, query);
    },
  });
}
