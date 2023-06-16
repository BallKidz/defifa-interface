import request, { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "react-query";

const query = gql`
  query topHodlrsQuery {
    owners {
      id
      ownedTokens {
        gameId
      }
    }
  }
`;

export function useTopHodlrs() {
  const {
    chainData: { subgraph },
  } = useChainData();

  return useQuery("topHodlrs", () => {
    return request(subgraph, query);
  });
}
