import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Button from "components/UI/Button";
import { useGameContext } from "contexts/GameContext";
import { BigNumber } from "ethers";
import { useSubmitScorecard } from "hooks/write/useSubmitScorecard";
import { DefifaTierRedemptionWeight } from "types/interfaces";
import { redemptionWeightToPercentage } from "utils/defifa";

export function CustomScorecardActions({
  scorecard,
}: {
  scorecard: DefifaTierRedemptionWeight[];
}) {
  const { governor } = useGameContext();
  const { write, isLoading } = useSubmitScorecard(scorecard, governor);

  const totalScore =
    scorecard?.reduce(
      (acc, curr) => acc.add(curr.redemptionWeight),
      BigNumber.from(0)
    ) ?? BigNumber.from(0);

  const totalScorePercentage = redemptionWeightToPercentage(totalScore);

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
