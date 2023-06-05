import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { QueueNextPhaseButton } from "components/GameDashboard/QueueNextPhaseButton/QueueNextPhaseButton";
import { DefifaGamePhase } from "components/GameDashboard/QueueNextPhaseButton/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";
import { useCountdown } from "hooks/useCountdown";
import { useGameTimes } from "hooks/read/useGameTimes";
import { useNextPhaseNeedsQueueing } from "hooks/read/PhaseNeedQueueing";
import { twJoin } from "tailwind-merge";

const phaseText = (phase: DefifaGamePhase) => {
  switch (phase) {
    case DefifaGamePhase.COUNTDOWN:
      return "Countdown";
    case DefifaGamePhase.MINT:
      return "Minting open";
    case DefifaGamePhase.REFUND:
      return "Refunds open";
    case DefifaGamePhase.COMPLETE:
      return "Game over: collect ETH";
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
    loading: { currentFundingCycleLoading },
  } = useGameContext();
  const { data: nextPhaseNeedsQueueing } = useNextPhaseNeedsQueueing();
  const { data: gameTimes } = useGameTimes();

  const currentPhaseText = phaseText(currentPhase);

  const nextPhaseText =
    currentPhase === DefifaGamePhase.MINT &&
    (gameTimes?.refundDuration ?? 0) === 0
      ? phaseText(DefifaGamePhase.SCORING)
      : currentPhase < DefifaGamePhase.SCORING
      ? phaseText(currentPhase + 1)
      : null;

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
    <div className="border border-gray-800 py-5 px-6 rounded-xl">
      <div className="flex md:justify-between flex-col md:flex-row items-center gap-4">
        <div className="flex flex-col text-center md:text-left gap-1">
          <div className="text-neutral-300">Current phase</div>
          <div className="text-2xl uppercase">{currentPhaseText}</div>
        </div>

        <div>
          {(currentPhase === DefifaGamePhase.MINT ||
            currentPhase === DefifaGamePhase.REFUND) &&
          !currentFundingCycleLoading &&
          timeRemainingText &&
          !waitingForBlock ? (
            <div className="text-center">
              <div className="text-xs mb-1">Phase ends in</div>
              <div className="text-4xl" style={{ color: "#EB007B" }}>
                {timeRemainingText}
              </div>
            </div>
          ) : null}
          {(currentPhase === DefifaGamePhase.MINT ||
            currentPhase === DefifaGamePhase.REFUND) &&
          !currentFundingCycleLoading &&
          waitingForBlock ? (
            <div className="text-center">
              <div>Next phase starting, waiting for next block...</div>
            </div>
          ) : null}
        </div>

        {nextPhaseText ? (
          <div className="flex flex-col gap-1 md:items-end md:text-right text-center">
            <div className="flex gap-2 items-center">
              Next: <span className="uppercase">{nextPhaseText}</span>{" "}
              {!nextPhaseNeedsQueueing ? (
                <CheckCircleIcon className="h-4 w-4" />
              ) : null}
            </div>
            <div>
              {nextPhaseNeedsQueueing ? <QueueNextPhaseButton /> : null}
            </div>
          </div>
        ) : null}
      </div>

      {currentPhase === DefifaGamePhase.MINT ||
      currentPhase === DefifaGamePhase.REFUND ? (
        <div className="w-full rounded-full bg-gray-800 transition-all mt-3">
          <div
            className={twJoin(
              "rounded-full h-2",
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
      ) : null}
    </div>
  );
}
