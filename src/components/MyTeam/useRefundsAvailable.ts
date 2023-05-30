import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";

export function useRefundsAvailable(): boolean {
  const {
    currentPhase,
    loading: { currentPhaseLoading },
  } = useGameContext();

  return (
    !currentPhaseLoading &&
    (currentPhase === DefifaGamePhase.MINT ||
      currentPhase === DefifaGamePhase.REFUND ||
      currentPhase === DefifaGamePhase.NO_CONTEST ||
      currentPhase === DefifaGamePhase.NO_CONTEST_INEVITABLE)
  );
}
