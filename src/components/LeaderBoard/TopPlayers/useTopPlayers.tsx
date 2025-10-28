import request, { gql } from "graphql-request";
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
      return request(subgraph, query);
    },
  });
}
