import request, { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "react-query";

const query = gql`
  query gameMintsQuery($gameId: String!) {
    contracts(where: { gameId: $gameId }) {
      mintedTokens {
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

  return useQuery(
    ["game-mints", gameId],
    async () => {
      const res = await request(subgraph, query, {
        gameId: gameId.toString(),
      });

      return res?.contracts?.[0]?.mintedTokens ?? [];
    },
    {
      enabled: !!gameId,
    }
  );
}
