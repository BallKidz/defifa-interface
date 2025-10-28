import {
  DefifaGamePhase,
  useCurrentGamePhase,
} from "hooks/read/useCurrentGamePhase";
import { useGameTimes } from "hooks/read/useGameTimes";
import { useGamePotBalance } from "hooks/read/useGamePotBalance";
import { Game } from "hooks/useAllGames";
import { OmnichainGame } from "hooks/useOmnichainGames";
import { useChainData } from "hooks/useChainData";
import { buildGamePath } from "lib/networks";
import Link from "next/link";
import { FC } from "react";
import { fromWad6 } from "utils/format/formatNumber";

const phaseText = (phase?: DefifaGamePhase) => {
  switch (phase) {
    case DefifaGamePhase.COUNTDOWN:
      return "Countdown";
    case DefifaGamePhase.MINT:
      return "Minting open";
    case DefifaGamePhase.REFUND:
      return "Refunds open";
    case DefifaGamePhase.COMPLETE:
      return "Redeem";
    case DefifaGamePhase.NO_CONTEST:
      return "No contest. Refunds open.";
    case DefifaGamePhase.NO_CONTEST_INEVITABLE:
      return "No contest inevitable. Refunds open.";
    case DefifaGamePhase.SCORING:
      return "Scoring";
    default:
      return "Game Over";
  }
};

const availableActionsText = (phase?: DefifaGamePhase) => {
  switch (phase) {
    case DefifaGamePhase.COUNTDOWN:
      return "Minting soon";
    case DefifaGamePhase.MINT:
      return "Mint | Refund";
    case DefifaGamePhase.REFUND:
      return "Keep | Refund";
    case DefifaGamePhase.COMPLETE:
      return "Keep | Redeem";
    case DefifaGamePhase.NO_CONTEST:
      return "Keep | Refund";
    case DefifaGamePhase.NO_CONTEST_INEVITABLE:
      return "Keep | Refund";
    case DefifaGamePhase.SCORING:
      return "Score";
    default:
      return "Keep";
  }
};

export const GameRow: FC<{ game: Game | OmnichainGame; chainId?: number }> = ({ game, chainId }) => {
  const { gameId, name } = game;
  const { chainData } = useChainData();
  
  // For omnichain games, use the game's chainId; otherwise use the provided chainId or current chain
  const isOmnichainGame = 'chainId' in game && 'networkAbbr' in game;
  const targetChainId = isOmnichainGame ? (game as OmnichainGame).chainId : (chainId || chainData.chainId);
  
  const { data: times } = useGameTimes(gameId, targetChainId);
  const date = times?.start ? new Date(times.start * 1000) : new Date();
  const { data: treasuryAmount, isLoading: treasuryLoading, error: treasuryError } = useGamePotBalance(gameId, targetChainId);
  
  // Debug pot balance for arcade
  console.log(`🏛️ Arcade Game ${gameId}:`, {
    treasuryAmount: treasuryAmount?.toString() || "null",
    treasuryLoading,
    treasuryError: treasuryError?.message || null
  });

  // const currentDate = new Date(); // Get the current date and time
  const { data: currentPhase } = useCurrentGamePhase(gameId, targetChainId);

  // Build game URL with network prefix (e.g., /game/sep:32)
  const gameUrl = buildGamePath(targetChainId, gameId);

  return (
    <tr className="text-sm cursor-pointer hover:font-semibold">
      <td className="whitespace-nowrap py-4 pl-4 pr-3">
        <Link href={gameUrl} className="block">
          {isOmnichainGame ? (game as OmnichainGame).networkName : 'Current Network'}
        </Link>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3">
        <Link href={gameUrl} className="block">
          {gameId}
        </Link>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3">
        <Link href={gameUrl} className="block">
          <span>{name}</span>
        </Link>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 hidden md:table-cell">
        <Link href={gameUrl} className="block">
          {currentPhase === DefifaGamePhase.MINT ? (
            <span>{`Mint until ${date.toLocaleString()}`}</span>
          ) : currentPhase === DefifaGamePhase.NO_CONTEST_INEVITABLE ? (
            <span>{"Referee no show"}</span>
          ) : currentPhase === DefifaGamePhase.NO_CONTEST ? (
            <span>{"Referee no show"}</span>
          ) : (
            <span>{phaseText(currentPhase)}</span>
          )}
        </Link>
      </td>

      <td className="whitespace-nowrap py-4 pl-4 pr-3 hidden md:table-cell">
        <Link href={gameUrl} className="block">
          <span data-treasury-amount={treasuryAmount?.toString() || "0"}>
            {fromWad6(treasuryAmount)} Ξ
          </span>
        </Link>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 hidden md:table-cell">
        <Link href={gameUrl} className="block">
          {availableActionsText(currentPhase)}
        </Link>
      </td>
    </tr>
  );
};
