import { useMemo } from "react";
import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";

export function useCurrentPhaseTitle() {
  const {
    currentPhase,
    nfts: { totalSupply, tiers },
    loading: { currentPhaseLoading },
  } = useGameContext();

  const hasMints = useMemo(() => {
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
  }, [tiers, totalSupply]);

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
      return hasMints ? "Scoring" : "No Contest";
    default:
      return "Game Over";
  }
}
