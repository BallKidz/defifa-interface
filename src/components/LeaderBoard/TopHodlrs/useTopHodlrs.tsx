import { gql } from "graphql-request";
import { requestWithAuth } from "lib/graphql";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";

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

  return useQuery({
    queryKey: ["topHodlrs"],
    queryFn: () => {
      return requestWithAuth(subgraph, query);
    },
  });
}
