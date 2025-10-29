import axios from "axios";
import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";
import { DefifaProjectMetadata } from "types/defifa";
import { getIpfsUrl } from "utils/ipfs";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useGameMetadata(projectId: number, chainIdOverride?: number) {
  const { chainData: connectedChainData } = useChainData();
  
  const targetChainId = chainIdOverride || connectedChainData.chainId;
  const chainData = chainIdOverride ? getChainData(chainIdOverride) : connectedChainData;

  // Use the same query key as useProjectCurrentFundingCycle to share the result
  const { data: subgraphData } = useQuery({
    queryKey: ["game-delegate", projectId, targetChainId],
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_THEGRAPH_API_KEY;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      // The Graph handles BigInt comparisons as strings in where clauses
      const query = `
        query GetGameDelegate($gameId: String!) {
          contracts(where: {gameId: $gameId}) {
            id
            address
            gameId
            name
          }
        }
      `;
      // Convert gameId to string for BigInt comparison
      const variables = { gameId: projectId.toString() };
      
      
      const response = await fetch(chainData.subgraph, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
      });
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        throw new Error(`Failed to fetch game metadata: ${response.statusText}`);
      }
      
      const json = await response.json();
      
      if (json.errors) {
        console.error("GraphQL errors:", json.errors);
        throw new Error(`GraphQL error: ${JSON.stringify(json.errors)}`);
      }
      
      // Handle case where game doesn't exist in subgraph
      if (!json.data?.contracts || json.data.contracts.length === 0) {
        console.warn(`Game ${projectId} not found in subgraph on chain ${targetChainId}`);
        return null; // Return null instead of undefined to avoid React Query error
      }
      
      return json.data.contracts[0];
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to reduce subgraph calls
    refetchInterval: false, // Disable automatic refetching
  });

  const nftAddress = subgraphData?.address;

  // Get the contract URI from the NFT contract (DefifaDelegate)
  const { data: contractUri, error: uriError } = useReadContract({
    address: (nftAddress as `0x${string}`) || "0x0",
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "contractURI",
    chainId: targetChainId,
    query: {
      enabled: !!nftAddress,
    },
  });

  if (uriError) {
    console.error(`useGameMetadata error for project ${projectId}:`, uriError);
  }

  console.log(`useGameMetadata(${projectId}):`, {
    nftAddress,
    contractUri,
    chainId: targetChainId,
    error: uriError,
  });

  return useQuery({
    queryKey: ["metadata", contractUri, targetChainId],
    queryFn: async () => {
      if (!contractUri || typeof contractUri !== "string") return;

      const res = await axios.get<DefifaProjectMetadata>(
        getIpfsUrl(contractUri)
      );
      return res.data;
    },
    enabled: !!contractUri,
  });
}
