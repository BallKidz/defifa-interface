import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Button from "components/UI/Button";
import { ONE_BILLION } from "hooks/NftRewards";
import { DefifaTierRedemptionWeight } from "types/interfaces";

export function CustomScorecardActions({
  scorecard,
}: {
  scorecard: DefifaTierRedemptionWeight[];
}) {
  const totalScore =
    scorecard?.reduce((acc, curr) => acc + curr.redemptionWeight, 0) ?? 0;

  console.log(scorecard);

  const totalScorePercentage = (totalScore / ONE_BILLION) * 100;

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        {totalScorePercentage}% allocated
        {totalScorePercentage === 100 ? (
          <CheckCircleIcon className="h-5 w-5" />
        ) : null}
      </div>
      {totalScorePercentage > 100 ? (
        <span className="text-red-500">Can&apos;t allocate more than 100%</span>
      ) : null}
      <Button disabled={totalScorePercentage !== 100}>Submit scorecard</Button>
    </div>
  );
}
