import { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { useChainData } from "./useChainData";
import { getChainData } from "config";
import { requestWithAuth } from "lib/graphql";

const allGamesQuery = gql`
  query myTeamsQuery {
    contracts(orderBy: gameId, orderDirection: desc) {
      name
      address
      gameId
    }
  }
`;

export interface Game {
  gameId: number;
  name: string;
  address: string;
}

export function useAllGames(chainIdOverride?: number) {
  const { chainData } = useChainData();
  const targetChainId = chainIdOverride || chainData.chainId;
  const targetChainData = chainIdOverride ? getChainData(chainIdOverride) : chainData;
  const graphUrl = targetChainData.subgraph;

  return useQuery({
    queryKey: ["allGames", targetChainId],
    queryFn: async () => {
      const res = await requestWithAuth<{ contracts: Game[] }>(graphUrl, allGamesQuery);
      console.log(res);
      return res.contracts;
    },
  });
}
