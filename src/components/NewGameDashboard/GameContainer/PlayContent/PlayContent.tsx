import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
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
      <Container className="mb-6 border border-gray-800 py-5 px-6 rounded-xl">
        <PhaseDetails />
      </Container>
      <CurrentContent />
    </div>
  );
}
