import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Button from "components/UI/Button";
import { useGameContext } from "contexts/GameContext";
import { useSubmitScorecard } from "hooks/write/useSubmitScorecard";
import { percentageToRedemptionWeight } from "utils/defifa";
import { ScorecardPercentages } from "./CustomScorecardContent";
import {
  DefifaTierRedemptionWeight,
  DefifaTierRedemptionWeightParams,
} from "types/defifa";

function useTierRedemptionWeights(
  scorecardPercentages: ScorecardPercentages
): DefifaTierRedemptionWeightParams[] {
  const {
    nfts: { tiers },
  } = useGameContext();

  // Only include tiers that have valid percentage values AND have been minted
  const weights = tiers?.filter((tier) => {
    const percentage = scorecardPercentages[tier.id.toString()];
    const hasMints = tier.minted > 0;
    
    return percentage !== undefined && 
           percentage !== null && 
           typeof percentage === 'number' && 
           !isNaN(percentage) && 
           percentage > 0 &&
           hasMints; // Only include tiers with mints to prevent revert
  }).map((tier) => {
    const percentage = scorecardPercentages[tier.id.toString()] ?? 0;
    
    // Ensure percentage is a valid number
    const validPercentage = typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0;
    
    return {
      id: tier.id,
      redemptionWeight: percentageToRedemptionWeight(validPercentage),
    };
  });

  return weights ?? [];
}

export function CustomScorecardActions({
  scorecardPercentages,
  onSuccess,
}: {
  scorecardPercentages: ScorecardPercentages;
  onSuccess?: () => void;
}) {
  const { governor, gameId, nfts } = useGameContext();

  const tierRedemptionWeights = useTierRedemptionWeights(scorecardPercentages);

  const { write, isLoading, error, isError } = useSubmitScorecard(
    gameId,
    tierRedemptionWeights,
    governor,
    onSuccess
  );

  // Calculate total percentage, excluding unminted tiers
  const totalScorePercentage =
    Object.entries(scorecardPercentages).reduce((acc, [tierId, percentage]) => {
      const tier = nfts.tiers?.find(t => t.id.toString() === tierId);
      // Only count percentage if tier has mints
      if (tier && tier.minted > 0) {
        return (acc ?? 0) + (percentage ?? 0);
      }
      return acc ?? 0;
    }, 0) ?? 0;


  return (
    <div>
      <div className="flex gap-2 items-center">
        {totalScorePercentage.toString()}% allocated
        {totalScorePercentage === 100 ? (
          <CheckCircleIcon className="h-5 w-5" />
        ) : null}
      </div>
      {totalScorePercentage > 100 ? (
        <span className="text-red-500">Can't allocate more than 100%</span>
      ) : null}
      {isError && error ? (
        <span className="text-red-500 text-sm">Error: {error.message}</span>
      ) : null}
      <Button
        onClick={() => {
          if (write) {
            write();
          }
        }}
        loading={isLoading}
        disabled={totalScorePercentage !== 100 || !write}
        className="w-full mt-5"
      >
        {totalScorePercentage !== 100 
          ? `Submit scores (${totalScorePercentage}% allocated)` 
          : "Submit scores"
        }
      </Button>
    </div>
  );
}
