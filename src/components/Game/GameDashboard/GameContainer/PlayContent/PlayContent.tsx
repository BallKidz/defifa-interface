import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { CompletePhaseContent } from "./CompletePhase/CompletePhaseContent";
import { CountdownPhaseContent } from "./CountdownPhaseContent";
import { MintPhaseContent } from "./MintPhase/MintPhaseContent";
import { RefundPhaseContent } from "./RefundPhase/RefundPhaseContent";
import { ScoringPhaseContent } from "./ScoringPhase/ScoringPhaseContent";

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
    <Container>
      <div className="py-3 col-span-2">
        <CurrentContent />
      </div>
    </Container>
  );
}
