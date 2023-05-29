import Button from "components/UI/Button";
import { useNextPhaseNeedsQueueing } from "hooks/read/PhaseNeedQueueing";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import { useQueueNextPhase } from "hooks/write/useQueueNextPhase";

export function QueueNextPhaseButton() {
  const { write, isLoading } = useQueueNextPhase();
  const { data: queueData, isLoading: nextPhaseNeedsQueueingLoading } =
    useNextPhaseNeedsQueueing();
  const { data } = useProjectCurrentFundingCycle();

  const fundingCycle = data?.fundingCycle.number.toNumber();
  let needsQueueing = queueData! as unknown as boolean;

  return (
    <Button
      onClick={() => {
        write?.();
      }}
      disabled={false || nextPhaseNeedsQueueingLoading || !needsQueueing}
    >
      {isLoading || nextPhaseNeedsQueueingLoading ? (
        <span>...</span>
      ) : needsQueueing ? (
        <span> Queue phase {fundingCycle + 1}</span>
      ) : (
        <span> Phase {fundingCycle + 1} Already Queued</span>
      )}
    </Button>
  );
}
