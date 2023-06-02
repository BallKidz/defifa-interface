import { useGameContext } from "contexts/GameContext";
import { QueueNextPhaseButton } from "./QueueNextPhaseButton";
import { useCurrentGamePhase } from "./useCurrentGamePhase";

const CurrentPhase = () => {
  const { gameId } = useGameContext();
  const { data: currentPhase } = useCurrentGamePhase(gameId);

  return (
    <div className="my-3">
      <p>Current phase: {currentPhase}</p>
      <QueueNextPhaseButton />
    </div>
  );
};

export default CurrentPhase;
