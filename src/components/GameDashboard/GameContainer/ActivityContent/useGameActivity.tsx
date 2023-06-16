import { useGameContext } from "contexts/GameContext";
import request, { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

// BROKEN TODO
const query = gql`
  query gameActivityQuery($gameId: String!) {
    transfers(where: { token_: { gameId: $gameId } }, orderBy: timestamp, orderDirection: desc) {
      transactionHash
      timestamp
      from {
        id
      }
      to {
        id
      }
      token {
        number
        metadata {
          image
          name
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
