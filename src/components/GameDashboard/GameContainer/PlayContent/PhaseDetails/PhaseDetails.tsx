import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { QueueNextPhaseButton } from "components/GameDashboard/GameContainer/PlayContent/PhaseDetails/QueueNextPhaseButton";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";
import { useCountdown } from "hooks/useCountdown";
import { useGameTimes } from "hooks/read/useGameTimes";
import { useNextPhaseNeedsQueueing } from "hooks/read/PhaseNeedQueueing";
import { twJoin } from "tailwind-merge";
import Button from "components/UI/Button";
import { Modal, useModal } from "components/UI/Modal/Modal";
import { RulesContent } from "../../RulesContent/RulesContent";

const phaseText = (phase: DefifaGamePhase) => {
  switch (phase) {
    case DefifaGamePhase.COUNTDOWN:
      return "Countdown";
    case DefifaGamePhase.MINT:
      return "Minting open";
    case DefifaGamePhase.REFUND:
      return "Refunds open";
    case DefifaGamePhase.COMPLETE:
      return "Game over - collect ETH";
    case DefifaGamePhase.NO_CONTEST:
      return "No Contest";
    case DefifaGamePhase.NO_CONTEST_INEVITABLE:
      return "No Contest Inevitable";
    case DefifaGamePhase.SCORING:
      return "Scoring";
    default:
      return "Game Over";
  }
};

export function PhaseDetails() {
  const {
    currentPhase,
    currentFundingCycle,
    loading: { currentFundingCycleLoading, currentPhaseLoading },
    metadata,
  } = useGameContext();
  const modal = useModal();
  const {
    data: nextPhaseNeedsQueueing,
    isLoading: nextPhaseNeedsQueueingLoading,
  } = useNextPhaseNeedsQueueing();

  const currentPhaseText = phaseText(currentPhase);

  const start = currentFundingCycle?.fundingCycle?.start?.toNumber() ?? 0;
  const duration = currentFundingCycle?.fundingCycle?.duration?.toNumber() ?? 0;
  const end = start + duration;
  const timeElapsed = Date.now() / 1000 - start;
  const waitingForBlock = Date.now() / 1000 > end;

  const { timeRemaining: timeRemainingText } = useCountdown(
    new Date(end * 1000)
  );
  const percentElapsed = Math.min((timeElapsed / duration) * 100, 100);

  return (
    <div>
      {nextPhaseNeedsQueueing && !nextPhaseNeedsQueueingLoading ? (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg mb-7">
          <div className="flex justify-between items-start mb-2">
            Next phase needs queueing
            {/* <Button category="tertiary" className="bg-transparent min-w-0 text-gray-50">
            <XMarkIcon className="h-5 w-5 inline" />
          </Button> */}
          </div>
          <div className="">
            <QueueNextPhaseButton />
          </div>
        </div>
      ) : null}
      <div className="flex md:justify-between flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="h-[10px] w-[10px] bg-lime-400 shadow-glowGreen rounded-full"></span>
          <div className="text-2xl">{currentPhaseText}</div>
          {(currentPhase === DefifaGamePhase.MINT ||
            currentPhase === DefifaGamePhase.REFUND) &&
          !currentFundingCycleLoading &&
          timeRemainingText &&
          !waitingForBlock ? (
            <div className="bg-rose-700 shadow-glowPink rounded-md px-2.5">
               {timeRemainingText}
            </div>
          ) : null}
        </div>

        {/* <Button
          category="tertiary"
          className="hidden md:block text-sm text-neutral-300"
          onClick={() => modal.setIsOpen(true)}
        >
          <QuestionMarkCircleIcon className="h-4 w-4 inline" /> How to play
        </Button> */}
      </div>
      {/* 
      {currentPhase === DefifaGamePhase.MINT ||
      currentPhase === DefifaGamePhase.REFUND ? (
        <div className="w-full rounded-full bg-neutral-800 transition-all mt-3">
          <div
            className={twJoin(
              "rounded-full h-1",
              percentElapsed > 80
                ? "bg-red-700"
                : percentElapsed > 50
                ? "bg-orange-500"
                : "bg-blue-800"
            )}
            style={{
              width: `${percentElapsed}%`,
            }}
          />
        </div>
      ) : (
        <div className="w-full rounded-full bg-neutral-800 transition-all mt-3">
          <div className="rounded-full h-1 bg-neutral-800" />
        </div>
      )} */}
      <Modal title="How to play" {...modal}>
        <RulesContent />
      </Modal>
    </div>
  );
}
