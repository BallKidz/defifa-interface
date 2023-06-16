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
import { useState } from "react";
import { ActivityContent } from "../ActivityContent/ActivityContent";
import { twJoin } from "tailwind-merge";

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
  const [currentTab, setCurrentTab] = useState<"players" | "activity">(
    "activity"
  );
  const players = useGamePlayers();
  return (
    <div>
      <ul className="flex text-sm gap-2 items-center mb-2">
        <li
          className={twJoin(
            currentTab === "activity"
              ? "bg-neutral-900 text-neutral-50 rounded-md"
              : "text-neutral-400",
            "cursor-pointer hover:text-neutral-300 px-3 py-1"
          )}
        >
          <a onClick={() => setCurrentTab("activity")}>Feed</a>
        </li>
        <li
          className={twJoin(
            currentTab === "players"
              ? "bg-neutral-900 text-neutral-50 rounded-md"
              : "text-neutral-400",
            "cursor-pointer hover:text-neutral-300 px-3 py-1"
          )}
        >
          <a onClick={() => setCurrentTab("players")}>Players</a>
        </li>
      </ul>
      {currentTab === "players"
        ? players.map((player) => (
            <div key={player} className="text-sm">
              <EthAddress withEnsAvatar address={player} />
            </div>
          ))
        : null}
      {currentTab === "activity" ? <ActivityContent /> : null}
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
    <Container className="grid grid-cols-[240px_1fr_350px] items-start bg-neutral-950">
      <div className="py-3 pr-2 overflow-auto h-fit">
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
