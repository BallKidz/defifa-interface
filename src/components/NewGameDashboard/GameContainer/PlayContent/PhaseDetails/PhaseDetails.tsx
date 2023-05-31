import { QueueNextPhaseButton } from "components/Navbar/Info/CurrentPhase/QueueNextPhaseButton";
import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";
import { useCountdown } from "hooks/Countdown";

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
  const { currentPhase, currentFundingCycle } = useGameContext();

  const currentPhaseText = phaseText(currentPhase);
  const nextPhaseText = phaseText(currentPhase + 1);

  const start = currentFundingCycle?.fundingCycle?.start?.toNumber() ?? 0;
  const duration = currentFundingCycle?.fundingCycle?.duration?.toNumber() ?? 0;
  const end = start + duration;

  const { timeRemaining } = useCountdown(new Date(end * 1000));

  return (
    <div className="bg-neutral-800 rounded-lg p-5  flex justify-between">
      <div className="flex flex-col gap-2">
        <div className="text-2xl uppercase">{currentPhaseText}</div>
        <div>{timeRemaining} left</div>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          Next: <span className="uppercase">{nextPhaseText}</span>
        </div>
        <QueueNextPhaseButton />
      </div>
    </div>
  );
}
