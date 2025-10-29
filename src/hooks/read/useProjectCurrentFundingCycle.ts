import { getChainData } from "config";
import { useChainData } from "hooks/useChainData";
import { JBFundingCycle, JBFundingCycleMetadata } from "types/juicebox";
import { useQuery } from "@tanstack/react-query";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useProjectCurrentFundingCycle(projectId: number, chainIdOverride?: number) {
  const { chainData: connectedChainData } = useChainData();
  
  const targetChainId = chainIdOverride || connectedChainData.chainId;
  const chainData = chainIdOverride ? getChainData(chainIdOverride) : connectedChainData;

  // Query the subgraph to get the delegate (NFT contract) address for this game
  const { data: subgraphData, isLoading: subgraphLoading, error } = useQuery({
    queryKey: ["game-delegate", projectId, targetChainId, "v1.0.1"],
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
            query GetGameDelegate($gameId: String!) {
              contracts(where: {gameId: $gameId}) {
                id
                address
                gameId
                name
              }
            }
          `,
          variables: { gameId: projectId.toString() },
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch game delegate: ${response.statusText}`);
      }
      
      const json = await response.json();
      
      if (json.errors) {
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

  // Query the actual current ruleset from JBRulesets contract
  const { data: rulesetData, isLoading: rulesetLoading } = useReadContract({
    address: chainData.JBRulesets?.address as `0x${string}`,
    abi: chainData.JBRulesets?.interface as Abi,
    functionName: "currentOf",
    args: projectId ? [BigInt(projectId)] : undefined,
    chainId: targetChainId,
    query: {
      enabled: !!projectId && !!chainData.JBRulesets?.address,
    },
  });

  console.log(`useProjectCurrentFundingCycle(${projectId}):`, {
    subgraph: chainData.subgraph,
    nftAddress,
    chainId: targetChainId,
    rulesetData,
    error,
  });

  // Parse the ruleset data from the contract
  // v5 currentOf returns: (JBRuleset ruleset, JBRulesetMetadata metadata)
  const ruleset = rulesetData as any;
  
  return {
    data: nftAddress && ruleset ? {
      fundingCycle: {
        number: ruleset[0]?.cycleNumber || BigInt(0),
        configuration: ruleset[0]?.id || BigInt(0),
        start: ruleset[0]?.start || BigInt(0),
        duration: ruleset[0]?.duration || BigInt(0),
        weight: ruleset[0]?.weight || BigInt(0),
        discountRate: ruleset[0]?.decayRate || BigInt(0),
      } as JBFundingCycle,
      metadata: {
        dataSource: nftAddress as string,
        dataHook: ruleset[1]?.dataHook,
        baseCurrency: ruleset[1]?.baseCurrency,
        pausePay: ruleset[1]?.pausePay || false,
        allowTerminalMigration: ruleset[1]?.allowTerminalMigration || false,
        allowSetTerminals: ruleset[1]?.allowSetTerminals || false,
      } as Partial<JBFundingCycleMetadata> as JBFundingCycleMetadata,
    } : undefined,
    isLoading: subgraphLoading || rulesetLoading,
    error,
  };
}
