import { QueueNextPhaseButton } from "components/Navbar/Info/CurrentPhase/QueueNextPhaseButton";
import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";
import { useCountdown } from "hooks/Countdown";
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

  const currentPhaseText = phaseText(currentPhase);
  const nextPhaseText = phaseText(currentPhase + 1);

  const start = currentFundingCycle?.fundingCycle?.start?.toNumber() ?? 0;
  const duration = currentFundingCycle?.fundingCycle?.duration?.toNumber() ?? 0;
  const end = start + duration;
  const timeElapsed = Date.now() / 1000 - start;

  const { timeRemaining: timeRemainingText } = useCountdown(
    new Date(end * 1000)
  );
  const percentElapsed = (timeElapsed / duration) * 100;

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-2xl uppercase">{currentPhaseText}</div>
          {currentPhase === DefifaGamePhase.MINT ||
          (currentPhase === DefifaGamePhase.REFUND &&
            !currentFundingCycleLoading &&
            timeRemainingText) ? (
            <div>{timeRemainingText} left</div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 items-end text-right">
          <div>
            Next: <span className="uppercase">{nextPhaseText}</span>
          </div>
          <div>
            <QueueNextPhaseButton />
          </div>
        </div>
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
