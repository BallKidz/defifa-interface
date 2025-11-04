import { useGameContext } from "contexts/GameContext";
import { useChainData } from "hooks/useChainData";
import { TiersApi } from "utils/outcomesAdapter";

/**
 * Hook that provides a TiersApi implementation
 * Uses GameContext to get tiers and subgraph to get owners
 */
export function useTiersApi(): TiersApi {
  const { nfts, gameId } = useGameContext();
  const { chainData } = useChainData();

  return {
    async fetchTiers(gameIdStr: string): Promise<Array<{ id: string; name?: string }>> {
      const tiers = nfts?.tiers || [];
      return tiers.map((tier) => {
        // Try multiple name properties: name, teamName, description
        const tierName = (tier as any)?.name || (tier as any)?.teamName || (tier as any)?.description;
        return {
          id: String(tier.id),
          name: tierName,
        };
      });
    },

    async fetchOwnersByTier(
      gameIdStr: string,
      tierId: string
    ): Promise<`0x${string}`[]> {
      // Import dynamically to avoid circular dependencies
      const { requestWithAuth } = await import("lib/graphql");
      const { gql } = await import("graphql-request");
      const { DEFAULT_NFT_MAX_SUPPLY } = await import("hooks/read/useDefifaTiers");

      const query = gql`
        query ownersByTier($gameId: String!, $tierNumber: BigInt!, $tierNumberPlus: BigInt!) {
          contracts(where: { gameId: $gameId }) {
            mintedTokens(
              where: {
                number_gte: $tierNumber
                number_lt: $tierNumberPlus
                owner_not: "0x0000000000000000000000000000000000000000"
              }
            ) {
              owner {
                id
              }
            }
          }
        }
      `;

      const tierNum = BigInt(Number(tierId) * DEFAULT_NFT_MAX_SUPPLY);
      const tierNumPlus = tierNum + BigInt(DEFAULT_NFT_MAX_SUPPLY);

      const res: {
        contracts?: {
          mintedTokens?: Array<{ owner: { id: string } }>;
        }[];
      } = await requestWithAuth(chainData.subgraph, query, {
        gameId: String(gameId),
        tierNumber: tierNum.toString(),
        tierNumberPlus: tierNumPlus.toString(),
      });

      const tokens = res?.contracts?.[0]?.mintedTokens || [];
      
      console.log(`[useTiersApi] Query for tier ${tierId} (range ${tierNum.toString()} to ${tierNumPlus.toString()}) returned ${tokens.length} tokens`);
      
      // Get unique owners
      const uniqueOwners = Array.from(
        new Set(tokens.map((t) => t.owner.id.toLowerCase()))
      );
      
      if (uniqueOwners.length > 0) {
        console.log(`[useTiersApi] Tier ${tierId} unique owners:`, uniqueOwners);
      }
      
      return uniqueOwners as `0x${string}`[];
    },
  };
}

