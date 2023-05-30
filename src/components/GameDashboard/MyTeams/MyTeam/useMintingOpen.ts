import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";

export function useMintingOpen(): boolean {
  const {
    currentPhase,
    loading: { currentPhaseLoading },
  } = useGameContext();

  return !currentPhaseLoading && currentPhase === DefifaGamePhase.MINT;
}
