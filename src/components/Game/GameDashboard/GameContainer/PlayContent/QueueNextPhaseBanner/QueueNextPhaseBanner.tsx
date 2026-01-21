import { useNextPhaseNeedsQueueing } from "hooks/read/PhaseNeedQueueing";
import { QueueNextPhaseButton } from "./QueueNextPhaseButton";
import { Tooltip } from "antd";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export function QueueNextPhaseBanner() {
  const {
    data: nextPhaseNeedsQueueing,
    isLoading: nextPhaseNeedsQueueingLoading,
  } = useNextPhaseNeedsQueueing();

  return nextPhaseNeedsQueueing && !nextPhaseNeedsQueueingLoading ? (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg mb-7">
      <div className="flex justify-between items-start mb-2">
        <Tooltip title="In every game, each phase plays a vital role in advancing the gameplay.
        To transition from one phase to the next, a blockchain transaction is required. The 
        phases encompass minting, refunding, scoring, and redeeming. It is important to queue
        the next phase to ensure the progression of the game.">
          Next phase needs queueing
          <QuestionMarkCircleIcon className="h-4 w-4 inline" />
        </Tooltip>
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
