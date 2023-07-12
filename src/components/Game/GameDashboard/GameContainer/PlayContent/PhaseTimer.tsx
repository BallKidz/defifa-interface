import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { useCountdown } from "hooks/useCountdown";

export function PhaseTimer() {
  const {
    currentPhase,
    currentFundingCycle,
    loading: { currentFundingCycleLoading },
  } = useGameContext();

  const start = currentFundingCycle?.fundingCycle?.start?.toNumber() ?? 0;
  const duration = currentFundingCycle?.fundingCycle?.duration?.toNumber() ?? 0;
  const end = start + duration;
  const waitingForBlock = Date.now() / 1000 > end;

  const { timeRemaining: timeRemainingText } = useCountdown(
    new Date(end * 1000)
  );

  return (
    <div className="flex md:justify-between flex-col md:flex-row items-center gap-4">
      <div className="flex items-center gap-3">
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
    </div>
  );
}
