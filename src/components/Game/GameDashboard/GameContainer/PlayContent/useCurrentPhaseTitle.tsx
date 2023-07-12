import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";

export function useCurrentPhaseTitle() {
  const {
    currentPhase,
    loading: { currentPhaseLoading },
  } = useGameContext();

  if (currentPhaseLoading) return;

  switch (currentPhase) {
    case DefifaGamePhase.COUNTDOWN:
      return "Countdown";
    case DefifaGamePhase.MINT:
      return "Minting live";
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
}
