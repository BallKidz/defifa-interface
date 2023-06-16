import { EthAddress } from "components/UI/EthAddress";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { constants } from "ethers";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { CompletePhaseContent } from "./CompletePhase/CompletePhaseContent";
import { CountdownPhaseContent } from "./CountdownPhaseContent";
import { MintPhaseContent } from "./MintPhase/MintPhaseContent";
import { useGameMints } from "./MintPhase/useGameMints";
import { PhaseDetails } from "./PhaseDetails/PhaseDetails";
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

function useGamePlayers() {
  const { gameId } = useGameContext();
  const { data: mints } = useGameMints(gameId);
  const players = Array.from(
    new Set(mints?.map((m: any) => m.owner.id) ?? [])
  ).filter((a) => a !== constants.AddressZero);
  return players as string[];
}

function LeftColumn() {
  const players = useGamePlayers();
  return (
    <div>
      <h2 className="text-neutral-300 font-medium text-sm mb-3">Players</h2>

      {players.map((player) => (
        <div key={player} className="text-sm">
          <EthAddress withEnsAvatar address={player} />
        </div>
      ))}
    </div>
  );
}

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
    <Container className="grid grid-cols-[230px_1fr_350px] items-start">
      <div className="py-5">
        <LeftColumn />
      </div>
      <div className="border-l border-neutral-800 py-3">
        <div className="mb-6 px-5">
          {currentPhase === DefifaGamePhase.MINT ||
          currentPhase === DefifaGamePhase.REFUND ||
          currentPhase === DefifaGamePhase.SCORING ||
          currentPhase === DefifaGamePhase.COMPLETE ? (
            <PhaseDetails />
          ) : null}
          {currentPhase === DefifaGamePhase.NO_CONTEST ||
          currentPhase === DefifaGamePhase.NO_CONTEST_INEVITABLE ? (
            <div className="text-center text-orange-500 uppercase text-2xl">
              No contest
            </div>
          ) : null}
        </div>
        <CurrentContent />
      </div>
      <div className="pt-5">
        <div className="p-3 rounded-xl bg-neutral-900 mr-5 min-h-[100px]">
          Mint
        </div>
      </div>
    </Container>
  );
}
