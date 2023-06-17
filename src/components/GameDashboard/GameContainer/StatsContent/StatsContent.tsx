import { EthAddress } from "components/UI/EthAddress";
import { useGameContext } from "contexts/GameContext";
import { constants } from "ethers";
import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { ActivityContent } from "../ActivityContent/ActivityContent";
import { useGameMints } from "../PlayContent/MintPhase/useGameMints";
import Container from "components/layout/Container";

function useGamePlayers() {
  const { gameId } = useGameContext();
  const { data: mints } = useGameMints(gameId);
  const players = Array.from(
    new Set(mints?.map((m: any) => m.owner.id) ?? [])
  ).filter((a) => a !== constants.AddressZero);
  return players as string[];
}

export function StatsContent() {
  const [currentTab, setCurrentTab] = useState<"players" | "activity">(
    "activity"
  );
  const players = useGamePlayers();
  return (
    <Container>
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
    </Container>
  );
}
