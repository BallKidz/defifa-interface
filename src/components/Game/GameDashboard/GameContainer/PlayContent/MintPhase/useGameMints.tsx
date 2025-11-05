import { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";
import { requestWithAuth } from "lib/graphql";
import { getChainData } from "config";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";

const query = gql`
  query gameMintsQuery($gameId: String!) {
    contracts(where: { gameId: $gameId }) {
      mintedTokens(where: { owner_not: "0x0000000000000000000000000000000000000000" }) {
        id
        number
        owner {
          id
        }
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

export interface UseGameMintsOptions {
  currentPhase?: DefifaGamePhase;
  pollingPhases?: DefifaGamePhase[];
  enablePolling?: boolean;
}

const DEFAULT_POLLING_PHASES = [DefifaGamePhase.MINT];

export function useGameMints(
  gameId: number,
  chainIdOverride?: number,
  options: UseGameMintsOptions = {}
) {
  const { chainData } = useChainData();

  const targetChainId = chainIdOverride || chainData.chainId;
  const targetChainData = chainIdOverride ? getChainData(chainIdOverride) : chainData;
  const subgraph = targetChainData.subgraph;

  const effectivePhase = options.currentPhase;
  const pollingPhases = options.pollingPhases ?? DEFAULT_POLLING_PHASES;

  const phaseAllowsPolling = effectivePhase !== undefined
    ? pollingPhases.includes(effectivePhase)
    : true;

  const shouldPoll = options.enablePolling ?? phaseAllowsPolling;

  return useQuery({
    queryKey: ["game-mints", targetChainId, gameId],
    queryFn: async () => {
      const res: { contracts?: { mintedTokens?: any[] }[] } = await requestWithAuth(subgraph, query, {
        gameId: gameId.toString(),
      });

      return res?.contracts?.[0]?.mintedTokens || [];
    },
    enabled: !!gameId,
    refetchInterval: shouldPoll ? 5 * 1000 : false,
    refetchIntervalInBackground: shouldPoll ? true : undefined,
    refetchOnWindowFocus: shouldPoll,
    staleTime: shouldPoll ? 0 : 5 * 60 * 1000,
  });
}
