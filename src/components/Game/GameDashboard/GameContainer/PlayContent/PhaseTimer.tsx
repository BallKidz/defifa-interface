import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { useGameTimes } from "hooks/read/useGameTimes";
import { useCountdown } from "hooks/useCountdown";

export function PhaseTimer() {
  const {
    currentPhase,
    gameId,
    loading: { currentPhaseLoading },
  } = useGameContext();

  const { data: gameTimes, isLoading: gameTimesLoading } = useGameTimes(gameId);

  // Calculate the correct end time based on current phase
  let endTime: Date | undefined;
  
  if (gameTimes && !gameTimesLoading) {
    const now = Date.now() / 1000;
    const { start, mintPeriodDuration, refundPeriodDuration } = gameTimes;
    
    if (currentPhase === DefifaGamePhase.MINT) {
      // Mint phase ends when refund period starts
      const mintEnd = start - refundPeriodDuration;
      endTime = new Date(mintEnd * 1000);
    } else if (currentPhase === DefifaGamePhase.REFUND) {
      // Refund phase ends when game starts
      endTime = new Date(start * 1000);
    }
  }

  const { timeRemaining: timeRemainingText } = useCountdown(endTime);

  return (
    <div className="flex md:justify-between flex-col md:flex-row items-center gap-4">
      <div className="flex items-center gap-3">
        {(currentPhase === DefifaGamePhase.MINT ||
          currentPhase === DefifaGamePhase.REFUND) &&
        !currentPhaseLoading &&
        !gameTimesLoading &&
        timeRemainingText &&
        endTime ? (
          <div className="bg-rose-700 shadow-glowPink rounded-md px-2.5">
             {timeRemainingText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
