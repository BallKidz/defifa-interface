import { useNextPhaseNeedsQueueing } from "hooks/read/PhaseNeedQueueing";
import { QueueNextPhaseButton } from "./QueueNextPhaseButton";

export function QueueNextPhaseBanner() {
  const {
    data: nextPhaseNeedsQueueing,
    isLoading: nextPhaseNeedsQueueingLoading,
  } = useNextPhaseNeedsQueueing();

  return nextPhaseNeedsQueueing && !nextPhaseNeedsQueueingLoading ? (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg mb-7">
      <div className="flex justify-between items-start mb-2">
        Next phase needs queueing
        {/* <Button category="tertiary" className="bg-transparent min-w-0 text-gray-50">
            <XMarkIcon className="h-5 w-5 inline" />
          </Button> */}
      </div>
      <div>
        <QueueNextPhaseButton />
      </div>
    </div>
  ) : null;
}
