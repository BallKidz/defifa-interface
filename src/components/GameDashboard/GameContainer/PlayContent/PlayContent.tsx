import { DefifaGamePhase } from "components/GameDashboard/QueueNextPhaseButton/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";
import { MintPhaseContent } from "./MintPhase/MintPhaseContent";
import { CountdownPhaseContent } from "./CountdownPhaseContent";
import { PhaseDetails } from "./PhaseDetails/PhaseDetails";
import Container from "components/UI/Container";
import { ScoringPhaseContent } from "./ScoringPhase/ScoringPhaseContent";
import { RefundPhaseContent } from "./RefundPhase/RefundPhaseContent";

const PHASE_CONTENT: { [k in DefifaGamePhase]: () => JSX.Element } = {
  [DefifaGamePhase.COUNTDOWN]: CountdownPhaseContent,
  [DefifaGamePhase.MINT]: MintPhaseContent,
  [DefifaGamePhase.REFUND]: RefundPhaseContent,
  [DefifaGamePhase.SCORING]: ScoringPhaseContent,
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
