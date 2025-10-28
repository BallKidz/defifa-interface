import { BigNumber } from "ethers";
import { useGameContext } from "contexts/GameContext";
import { useScorecards } from "hooks/useScorecards";
import { tokenNumberToTierId } from "utils/defifa";

export function useTokenRedemptionWeight(
  dataSource: string | undefined,
  tokenId: string
) {
  const { gameId } = useGameContext();
  const { data: scorecards } = useScorecards(gameId);
  
  // Get the tier ID from the token ID
  const tierId = tokenNumberToTierId(tokenId);
  
  // Find the active/ratified scorecard (assuming the first one is active)
  // TODO: We might need to check scorecard state to find the correct active one
  const activeScorecard = scorecards?.[0];
  
  // Find the redemption weight for this tier in the active scorecard
  const tierWeight = activeScorecard?.tierWeights?.find(
    (weight: any) => Number(weight.tierId) === tierId
  );
  
  // If no tier weight found, this tier gets 0% of the pot
  // Convert string redemption weight from subgraph to BigNumber
  const redemptionWeight = tierWeight?.redemptionWeight 
    ? BigNumber.from(tierWeight.redemptionWeight) 
    : BigNumber.from(0);

  console.log("🔥 useTokenRedemptionWeight debug", {
    dataSource,
    tokenId,
    tierId,
    gameId,
    scorecardsCount: scorecards?.length,
    activeScorecard: activeScorecard?.id,
    tierWeightsCount: activeScorecard?.tierWeights?.length,
    allTierWeights: activeScorecard?.tierWeights?.map((tw: any) => ({
      id: tw.id,
      tierId: tw.tierId,
      redemptionWeight: tw.redemptionWeight?.toString()
    })),
    lookingForTierId: tierId,
    tierWeight: tierWeight ? {
      id: tierWeight.id,
      tierId: tierWeight.tierId,
      redemptionWeight: tierWeight.redemptionWeight?.toString()
    } : null,
    redemptionWeight: redemptionWeight?.toString()
  });

  return {
    data: redemptionWeight,
    isLoading: false,
    error: null,
    isError: false
  };
}
