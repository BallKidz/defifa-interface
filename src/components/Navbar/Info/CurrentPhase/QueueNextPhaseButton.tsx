import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Button from "components/UI/Button";
import { useNextPhaseNeedsQueueing } from "hooks/read/PhaseNeedQueueing";
import { useQueueNextPhase } from "hooks/write/useQueueNextPhase";

export function QueueNextPhaseButton() {
  const { write, isLoading } = useQueueNextPhase();
  const {
    data: nextPhaseNeedsQueing,
    isLoading: nextPhaseNeedsQueueingLoading,
  } = useNextPhaseNeedsQueueing();

  return (
    <Button
      onClick={() => {
        write?.();
      }}
      disabled={false || nextPhaseNeedsQueueingLoading || !nextPhaseNeedsQueing}
      size="sm"
      variant="secondary"
    >
      {isLoading || nextPhaseNeedsQueueingLoading ? (
        <span>...</span>
      ) : nextPhaseNeedsQueing ? (
        <span>Queue next phase</span>
      ) : (
        <span className="flex gap-1 items-center">
          Next phase queued <CheckCircleIcon className="h-4 w-4" />
        </span>
      )}
    </Button>
  );
}
