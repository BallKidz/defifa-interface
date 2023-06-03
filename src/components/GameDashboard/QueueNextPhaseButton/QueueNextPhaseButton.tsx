import Button from "components/UI/Button";
import { useQueueNextPhase } from "hooks/write/useQueueNextPhase";

export function QueueNextPhaseButton() {
  const { write, isLoading } = useQueueNextPhase();

  return (
    <Button
      onClick={() => {
        write?.();
      }}
      size="sm"
      variant="tertiary"
      loading={isLoading}
    >
      Queue next phase
    </Button>
  );
}
