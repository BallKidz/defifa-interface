import {
  DefifaGamePhase,
  useCurrentGamePhase,
} from "hooks/read/useCurrentGamePhase";
import { useGameTimes } from "hooks/read/useGameTimes";
import { useGamePotBalance } from "hooks/read/useGamePotBalance";
import { Game } from "hooks/useAllGames";
import { NetworkGame } from "hooks/useMultiNetworkGames";
import { useChainData } from "hooks/useChainData";
import { buildGamePath } from "lib/networks";
import { useRouter } from "next/navigation";
import { FC, MouseEvent, useCallback } from "react";
import { fromWad6 } from "utils/format/formatNumber";
import { useFarcasterContext } from "hooks/useFarcasterContext";
import { useGameMints } from "components/Game/GameDashboard/GameContainer/PlayContent/MintPhase/useGameMints";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";

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

const availableActionsText = (phase?: DefifaGamePhase, mintedCount?: number) => {
  if (phase === DefifaGamePhase.SCORING && (mintedCount ?? 0) === 0) {
    return "No Contest";
  }

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

export const GameRow: FC<{ game: Game | NetworkGame; chainId?: number }> = ({ game, chainId }) => {
  const { gameId, name } = game;
  const { chainData } = useChainData();
  const { isInMiniApp } = useFarcasterContext();
  const { triggerSelection } = useMiniAppHaptics();
  const router = useRouter();
  
  // For games with network info, use the game's chainId; otherwise use the provided chainId or current chain
  const isNetworkGame = 'chainId' in game && 'networkAbbr' in game;
  const targetChainId = isNetworkGame ? (game as NetworkGame).chainId : (chainId || chainData.chainId);
  
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
  const { data: mintedTokens } = useGameMints(gameId, targetChainId);
  const mintedCount = mintedTokens?.length;

  // Build game URL with network prefix (e.g., /game/sep:32)
  const gameUrl = buildGamePath(targetChainId, gameId);
  
  // Handle row click - navigate programmatically
  const handleRowClick = useCallback(
    (event: MouseEvent<HTMLTableRowElement>) => {
      // Don't navigate if clicking on a link or button
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        return;
      }
      
      void triggerSelection();
      router.push(gameUrl);
    },
    [gameUrl, router, triggerSelection]
  );

  // Filter out no contest games (must be after all hooks)
  // Also filter out SCORING games with 0 mints (effectively no-contest)
  if (
    currentPhase === DefifaGamePhase.NO_CONTEST || 
    currentPhase === DefifaGamePhase.NO_CONTEST_INEVITABLE ||
    (currentPhase === DefifaGamePhase.SCORING && (mintedCount ?? 0) === 0)
  ) {
    return null;
  }

  return (
    <tr 
      className="text-sm cursor-pointer hover:font-semibold"
      onClick={handleRowClick}
    >
      <td className="whitespace-nowrap py-4 pl-4 pr-3">
        {gameId}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3">
        <span>{name}</span>
      </td>
      <td
        className={
          isInMiniApp
            ? "whitespace-nowrap py-4 pl-4 pr-3"
            : "whitespace-nowrap py-4 pl-4 pr-3 hidden md:table-cell"
        }
      >
        {currentPhase === DefifaGamePhase.MINT ? (
          <span>{`Mint until ${date.toLocaleString()}`}</span>
        ) : (
          <span>{phaseText(currentPhase)}</span>
        )}
      </td>

      <td
        className={
          isInMiniApp
            ? "whitespace-nowrap py-4 pl-4 pr-3"
            : "whitespace-nowrap py-4 pl-4 pr-3 hidden md:table-cell"
        }
      >
        <span data-treasury-amount={treasuryAmount?.toString() || "0"}>
          {fromWad6(treasuryAmount)} Ξ
        </span>
      </td>
      <td
        className={
          isInMiniApp
            ? "whitespace-nowrap py-4 pl-4 pr-3"
            : "whitespace-nowrap py-4 pl-4 pr-3 hidden md:table-cell"
        }
      >
        {availableActionsText(currentPhase, mintedCount)}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3">
        {isNetworkGame ? (game as NetworkGame).networkName : 'Current Network'}
      </td>
    </tr>
  );
};
