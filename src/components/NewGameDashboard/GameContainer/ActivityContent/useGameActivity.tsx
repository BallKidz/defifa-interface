import { useGameContext } from "contexts/GameContext";
import request, { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

// BROKEN TODO
const query = gql`
  query gameActivityQuery($gameId: String!) {
    contracts(where: { gameId: $gameId }) {
      mintedTokens {
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

export function useGameActivity() {
  const {
    chainData: { subgraph },
  } = useChainData();
  const { gameId } = useGameContext();

  return useQuery(
    ["gameActivity", gameId],
    () => {
      return request(subgraph, query, {
        gameId: gameId.toString(),
      });
    },
    {
      enabled: !!gameId,
    }
  );
}
