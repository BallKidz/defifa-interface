import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { CompletePhaseContent } from "./CompletePhase/CompletePhaseContent";
import { CountdownPhaseContent } from "./CountdownPhaseContent";
import { MintPhaseContent } from "./MintPhase/MintPhaseContent";
import { RefundPhaseContent } from "./RefundPhase/RefundPhaseContent";
import { ScoringPhaseContent } from "./ScoringPhase/ScoringPhaseContent";
import { NoContestPhaseContent } from "./NoContestPhase/NoContestPhaseContent";

const PHASE_CONTENT: { [k in DefifaGamePhase]: () => JSX.Element } = {
  [DefifaGamePhase.COUNTDOWN]: CountdownPhaseContent,
  [DefifaGamePhase.MINT]: MintPhaseContent,
  [DefifaGamePhase.REFUND]: RefundPhaseContent,
  [DefifaGamePhase.SCORING]: ScoringPhaseContent,
  [DefifaGamePhase.COMPLETE]: CompletePhaseContent,
  [DefifaGamePhase.NO_CONTEST]: NoContestPhaseContent,
  [DefifaGamePhase.NO_CONTEST_INEVITABLE]: NoContestPhaseContent,
};

export function PlayContent() {
  const {
    currentPhase,
    nfts: { totalSupply, tiers },
    loading: { currentPhaseLoading },
  } = useGameContext();

  if (currentPhaseLoading) {
    return <Container className="text-center">...</Container>;
  }

  const hasMints = (() => {
    if (tiers && tiers.length > 0) {
      return tiers.some((tier) => {
        const minted = (tier as { minted?: number }).minted;
        return minted !== undefined && Number(minted) > 0;
      });
    }

    if (!totalSupply) return false;

    if (
      typeof totalSupply === "object" &&
      "isZero" in totalSupply &&
      typeof (totalSupply as { isZero?: unknown }).isZero === "function"
    ) {
      return !(totalSupply as { isZero: () => boolean }).isZero();
    }

    const numeric =
      typeof totalSupply === "string"
        ? Number(totalSupply)
        : typeof totalSupply === "number"
        ? totalSupply
        : 0;
    return numeric > 0;
  })();
  const effectivePhase =
    currentPhase === DefifaGamePhase.SCORING && !hasMints
      ? DefifaGamePhase.NO_CONTEST
      : currentPhase;

  const CurrentContent = PHASE_CONTENT[effectivePhase] ?? null;

  return (
    <Container>
      <div className="py-3 col-span-2">
        <CurrentContent />
      </div>
    </Container>
  );
}
