import {
  DefifaGamePhase,
  useCurrentGamePhase,
} from "hooks/read/useCurrentGamePhase";
import { useGameTimes } from "hooks/read/useGameTimes";
import { usePaymentTerminalBalance } from "hooks/read/usePaymentTerminalBalance";
import { Game } from "hooks/useAllGames";
import Link from "next/link";
import { FC } from "react";
import { fromWad4 } from "utils/format/formatNumber";

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
      return "No Contest";
    case DefifaGamePhase.NO_CONTEST_INEVITABLE:
      return "No Contest Inevitable";
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

export const GameRow: FC<{ game: Game }> = ({ game }) => {
  const { gameId, name } = game;
  const { data: times } = useGameTimes(gameId);
  const date = new Date(times?.start * 1000);
  const { data: treasuryAmount } = usePaymentTerminalBalance(gameId);

  // const currentDate = new Date(); // Get the current date and time
  const { data: currentPhase } = useCurrentGamePhase(gameId);

  return (
    <Link href={`/game/${gameId}`}>
      <tr className="text-sm cursor-pointer hover:font-semibold">
        <td className="whitespace-nowrap py-4 pl-4 pr-3">{gameId}</td>
        <td className="whitespace-nowrap py-4 pl-4 pr-3">
          <span>{name}</span>
        </td>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 hidden md:table-cell">
          {currentPhase === DefifaGamePhase.MINT ? (
            <span>{`Mint until ${date.toLocaleString()}`}</span>
          ) : currentPhase === DefifaGamePhase.NO_CONTEST_INEVITABLE ? (
            <span>{"Referee no show"}</span>
          ) : currentPhase === DefifaGamePhase.NO_CONTEST ? (
            <span>{"Referee no show"}</span>
          ) : (
            <span>{phaseText(currentPhase)}</span>
          )}
        </td>

        <td className="whitespace-nowrap py-4 pl-4 pr-3 hidden md:table-cell">
          <span>{fromWad4(treasuryAmount)} Ξ</span>
        </td>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 hidden md:table-cell">
          {availableActionsText(currentPhase)}
        </td>
      </tr>
    </Link>
  );
};
