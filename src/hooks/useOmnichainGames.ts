import { useQuery } from "@tanstack/react-query";
import { getAllNetworks, getMainnetNetworks } from "lib/networks";
import { getChainData } from "config";
import request, { gql } from "graphql-request";

const allGamesQuery = gql`
  query myTeamsQuery {
    contracts(orderBy: gameId, orderDirection: desc) {
      name
      address
      gameId
    }
  }
`;

export interface OmnichainGame {
  gameId: number;
  name: string;
  address: string;
  chainId: number;
  networkAbbr: string;
  networkName: string;
}

interface NetworkGamesResult {
  chainId: number;
  networkAbbr: string;
  networkName: string;
  games: OmnichainGame[];
  error?: string;
}

export function useOmnichainGames(includeTestnets: boolean = false) {
  const allNetworks = includeTestnets ? getAllNetworks() : getMainnetNetworks();
  
  // Filter to only networks that have working subgraphs
  const networks = allNetworks.filter(network => {
    const chainData = getChainData(network.chainId);
    return chainData?.subgraph && chainData.subgraph.trim() !== "";
  });
  
  return useQuery({
    queryKey: ["omnichainGames", includeTestnets],
    queryFn: async (): Promise<OmnichainGame[]> => {
      // If no networks have working subgraphs, return empty array
      if (networks.length === 0) {
        console.warn("No networks with working subgraphs found");
        return [];
      }
      
      // Fetch games from all networks in parallel
      const promises = networks.map(async (network): Promise<NetworkGamesResult> => {
        try {
          const chainData = getChainData(network.chainId);
          if (!chainData?.subgraph || chainData.subgraph.trim() === "") {
            return {
              chainId: network.chainId,
              networkAbbr: network.abbreviation,
              networkName: network.name,
              games: [],
              error: "No subgraph configured"
            };
          }

          const res = await request<{ contracts: any[] }>(
            chainData.subgraph, 
            allGamesQuery
          );

          const games: OmnichainGame[] = res.contracts.map(game => ({
            ...game,
            chainId: network.chainId,
            networkAbbr: network.abbreviation,
            networkName: network.name,
          }));

          return {
            chainId: network.chainId,
            networkAbbr: network.abbreviation,
            networkName: network.name,
            games,
          };
        } catch (error) {
          console.warn(`Failed to fetch games from ${network.name}:`, error);
          return {
            chainId: network.chainId,
            networkAbbr: network.abbreviation,
            networkName: network.name,
            games: [],
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      });

      const results = await Promise.allSettled(promises);
      
      // Flatten all successful results
      const allGames: OmnichainGame[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { games, networkName, error } = result.value;
          allGames.push(...games);
          if (error) {
            errors.push(`${networkName}: ${error}`);
          }
        } else {
          const networkName = networks[index].name;
          errors.push(`${networkName}: ${result.reason}`);
        }
      });

      // Log errors for debugging but don't fail the entire query
      if (errors.length > 0) {
        console.warn("Some networks failed to load games:", errors);
      }

      // Sort by game ID descending (newest first)
      return allGames.sort((a, b) => b.gameId - a.gameId);
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2, // Retry failed requests twice
  });
}
