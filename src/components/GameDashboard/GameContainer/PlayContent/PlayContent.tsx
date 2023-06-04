import { DefifaGamePhase } from "components/GameDashboard/QueueNextPhaseButton/useCurrentGamePhase";
import Container from "components/UI/Container";
import { useGameContext } from "contexts/GameContext";
import { CountdownPhaseContent } from "./CountdownPhaseContent";
import { MintPhaseContent } from "./MintPhase/MintPhaseContent";
import { PhaseDetails } from "./PhaseDetails/PhaseDetails";
import { RefundPhaseContent } from "./RefundPhase/RefundPhaseContent";
import { ScoringPhaseContent } from "./ScoringPhase/ScoringPhaseContent";

const PHASE_CONTENT: { [k in DefifaGamePhase]: () => JSX.Element } = {
  [DefifaGamePhase.COUNTDOWN]: CountdownPhaseContent,
  [DefifaGamePhase.MINT]: MintPhaseContent,
  [DefifaGamePhase.REFUND]: RefundPhaseContent,
  [DefifaGamePhase.SCORING]: ScoringPhaseContent,
  [DefifaGamePhase.COMPLETE]: RefundPhaseContent,
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

  const CurrentContent = PHASE_CONTENT[currentPhase];

  return (
    <div>
      <Container className="mb-6">
        {currentPhase === DefifaGamePhase.MINT ||
        currentPhase === DefifaGamePhase.REFUND ||
        currentPhase === DefifaGamePhase.SCORING ? (
          <PhaseDetails />
        ) : null}
        {currentPhase === DefifaGamePhase.NO_CONTEST ||
        currentPhase === DefifaGamePhase.NO_CONTEST_INEVITABLE ? (
          <div className="text-center text-orange-500 uppercase text-2xl">
            No contest
          </div>
        ) : null}
      </Container>
      <CurrentContent />
    </div>
  );
}
