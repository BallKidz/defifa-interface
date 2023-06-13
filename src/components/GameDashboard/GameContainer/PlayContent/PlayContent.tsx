import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { CountdownPhaseContent } from "./CountdownPhaseContent";
import { MintPhaseContent } from "./MintPhase/MintPhaseContent";
import { PhaseDetails } from "./PhaseDetails/PhaseDetails";
import { RefundPhaseContent } from "./RefundPhase/RefundPhaseContent";
import { ScoringPhaseContent } from "./ScoringPhase/ScoringPhaseContent";
import { CompletePhaseContent } from "./CompletePhase/CompletePhaseContent";

const PHASE_CONTENT: { [k in DefifaGamePhase]: () => JSX.Element } = {
  [DefifaGamePhase.COUNTDOWN]: CountdownPhaseContent,
  [DefifaGamePhase.MINT]: MintPhaseContent,
  [DefifaGamePhase.REFUND]: RefundPhaseContent,
  [DefifaGamePhase.SCORING]: ScoringPhaseContent,
  [DefifaGamePhase.COMPLETE]: CompletePhaseContent,
  [DefifaGamePhase.NO_CONTEST]: RefundPhaseContent,
  [DefifaGamePhase.NO_CONTEST_INEVITABLE]: RefundPhaseContent,
};

export function PlayContent() {
  const {
    currentPhase,
    loading: { currentPhaseLoading },
  } = useGameContext();

  if (currentPhaseLoading) {
    return <Container className="text-center">...</Container>;
  }

  const CurrentContent = PHASE_CONTENT[currentPhase] ?? null;

  return (
    <div>
      <CurrentContent />
    </div>
  );
}
