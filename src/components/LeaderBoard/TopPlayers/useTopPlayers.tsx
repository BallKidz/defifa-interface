import request, { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "react-query";

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

  return useQuery("topPlayers", () => {
    return request(subgraph, query);
  });
}
