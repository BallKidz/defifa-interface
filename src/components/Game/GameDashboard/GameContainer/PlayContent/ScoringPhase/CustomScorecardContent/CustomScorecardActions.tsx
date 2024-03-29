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

  const weights = tiers?.map((tier) => {
    return {
      id: tier.id,
      redemptionWeight: percentageToRedemptionWeight(
        scorecardPercentages[tier.id.toString()] ?? 0
      ),
    };
  });

  return weights ?? [];
}

export function CustomScorecardActions({
  scorecardPercentages,
}: {
  scorecardPercentages: ScorecardPercentages;
}) {
  const { governor, gameId } = useGameContext();

  const tierRedemptionWeights = useTierRedemptionWeights(scorecardPercentages);

  const { write, isLoading } = useSubmitScorecard(
    gameId,
    tierRedemptionWeights,
    governor
  );

  const totalScorePercentage =
    Object.values(scorecardPercentages).reduce(
      (acc, curr) => (acc ?? 0) + (curr ?? 0),
      0
    ) ?? 0;

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
      <Button
        onClick={() => write?.()}
        loading={isLoading}
        disabled={totalScorePercentage !== 100}
        className="w-full mt-5"
      >
        Submit scores
      </Button>
    </div>
  );
}
