import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { QueueNextPhaseButton } from "components/Navbar/Info/CurrentPhase/QueueNextPhaseButton";
import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";
import { useCountdown } from "hooks/Countdown";
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
  const {
    data: nextPhaseNeedsQueueing,
    isLoading: nextPhaseNeedsQueueingLoading,
  } = useNextPhaseNeedsQueueing();

  const currentPhaseText = phaseText(currentPhase);
  const nextPhaseText =
    currentPhase <= DefifaGamePhase.NO_CONTEST_INEVITABLE
      ? phaseText(currentPhase + 1)
      : null;

  const start = currentFundingCycle?.fundingCycle?.start?.toNumber() ?? 0;
  const duration = currentFundingCycle?.fundingCycle?.duration?.toNumber() ?? 0;
  const end = start + duration;
  const timeElapsed = Date.now() / 1000 - start;

  const { timeRemaining: timeRemainingText } = useCountdown(
    new Date(end * 1000)
  );
  const percentElapsed = Math.min((timeElapsed / duration) * 100, 100);

  return (
    <div className="border border-gray-800 py-5 px-6 rounded-xl">
      <div className="flex md:justify-between flex-col md:flex-row items-center gap-4">
        <div className="flex flex-col text-center md:text-left gap-1">
          <div>Phase {currentPhase}</div>
          <div className="text-2xl uppercase">{currentPhaseText}</div>
        </div>

        <div>
          {(currentPhase === DefifaGamePhase.MINT ||
            currentPhase === DefifaGamePhase.REFUND) &&
          !currentFundingCycleLoading &&
          timeRemainingText ? (
            <div className="text-center">
              <div className="text-xs mb-1">Phase ends in</div>
              <div className="text-4xl">{timeRemainingText}</div>
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
