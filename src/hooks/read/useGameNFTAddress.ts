import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";

export function useGameNFTAddress(gameId: number) {
  const { chainData } = useChainData();

  const { data: nftAddress, isLoading, error } = useQuery({
    queryKey: ["game-nft-address", gameId, "v1.0.1"],
    queryFn: async () => {
      const response = await fetch(chainData.subgraph, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const json = await response.json();
      return json.data?.contracts?.[0]?.address;
    },
    enabled: !!gameId,
    staleTime: 60 * 60 * 1000, // Cache for 1 hour - NFT address doesn't change
    refetchInterval: false, // Don't auto-refetch
  });


  return { nftAddress, isLoading, error };
}
