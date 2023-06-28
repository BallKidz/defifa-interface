import { useGameContext } from "contexts/GameContext";
import request, { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

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

  return useQuery(
    ["picks", address, gameId],
    () => {
      return request<{
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
    {
      enabled: !!address,
    }
  );
}
