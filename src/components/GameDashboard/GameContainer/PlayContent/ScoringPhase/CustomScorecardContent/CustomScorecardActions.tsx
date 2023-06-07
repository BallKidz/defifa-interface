import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Button from "components/UI/Button";
import { useGameContext } from "contexts/GameContext";
import { useSubmitScorecard } from "hooks/write/useSubmitScorecard";
import { percentageToRedemptionWeight } from "utils/defifa";
import { ScorecardPercentages } from "./CustomScorecardContent";

export function CustomScorecardActions({
  scorecardPercentages,
}: {
  scorecardPercentages: ScorecardPercentages;
}) {
  const { governor } = useGameContext();

  const scorecard = Object.keys(scorecardPercentages).map((tierId) => {
    return {
      id: Number(tierId),
      redemptionWeight: percentageToRedemptionWeight(
        scorecardPercentages[tierId]
      ),
    };
  });

  const { write, isLoading } = useSubmitScorecard(scorecard, governor);

  const totalScorePercentage = Object.values(scorecardPercentages)?.reduce(
    (acc, curr) => acc + curr,
    0
  );

  return (
    <div className="flex justify-between items-center">
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
      >
        Submit scorecard
      </Button>
    </div>
  );
}
