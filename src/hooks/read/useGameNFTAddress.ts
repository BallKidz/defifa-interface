import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";

export function useGameNFTAddress(gameId: number) {
  const { chainData } = useChainData();

  const { data: nftAddress, isLoading, error } = useQuery({
    queryKey: ["game-nft-address", gameId],
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_THEGRAPH_API_KEY;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const response = await fetch(chainData.subgraph, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `
            query GetGameNFTAddress($gameId: String!) {
              contracts(where: {gameId: $gameId}) {
                id
                address
                name
              }
            }
          `,
          variables: { gameId: gameId.toString() },
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch NFT address: ${response.statusText}`);
      }
      
      const json = await response.json();
      
      if (json.errors) {
        throw new Error(`GraphQL error: ${JSON.stringify(json.errors)}`);
      }
      
      // Handle case where game doesn't exist in subgraph
      if (!json.data?.contracts || json.data.contracts.length === 0) {
        console.warn(`Game ${gameId} not found in subgraph`);
        return null; // Return null instead of undefined
      }
      
      return json.data.contracts[0].address;
    },
    enabled: !!gameId,
    staleTime: 60 * 60 * 1000, // Cache for 1 hour - NFT address doesn't change
    refetchInterval: false, // Don't auto-refetch
  });


  return { nftAddress, isLoading, error };
}
