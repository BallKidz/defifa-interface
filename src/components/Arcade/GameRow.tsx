import {
  DefifaGamePhase,
  useCurrentGamePhase,
} from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { useAllDuration } from "hooks/read/AllDurations";
import { useAllPaymentTerminalBalances } from "hooks/read/AllPaymentTerminalBalances";
import { useGameName } from "hooks/read/GameName";
import { Game } from "hooks/useAllGames";
import Link from "next/link";
import { FC } from "react";
import { fromWad4 } from "utils/format/formatNumber";

export const GameRow: FC<{ game: Game }> = ({ game }) => {
  const { gameId, name, address } = game;
  const dataSourceName = useGameName(address);
  const duration = useAllDuration(gameId);
  const date = new Date(duration?.start * 1000 + duration?.[1]);
  const { data: treasuryAmount } = useAllPaymentTerminalBalances(gameId);
  console.log("date", date);
  console.log("treasuryAmount", treasuryAmount);
  // const currentDate = new Date(); // Get the current date and time
  const { data: currentPhase } = useCurrentGamePhase(gameId);
  const isMintPhase = currentPhase === DefifaGamePhase.MINT;
  const getPhaseText = (): string => {
    switch (currentPhase) {
      case DefifaGamePhase.COUNTDOWN:
        return "Countdown";
      case DefifaGamePhase.MINT:
        return "Mint";
      case DefifaGamePhase.REFUND:
        return "Refund";
      case DefifaGamePhase.SCORING:
        return "Scoring";
      case DefifaGamePhase.NO_CONTEST_INEVITABLE:
        return "No Contest Inevitable";
      case DefifaGamePhase.NO_CONTEST:
        return "No Contest";
      default:
        return "";
    }
  };

  return (
    <Link href={`/game/${gameId}`}>
      <tr className="text-sm cursor-pointer hover:font-semibold">
        <td className="whitespace-nowrap py-4 pl-4 pr-3">{gameId}</td>
        <td className="whitespace-nowrap py-4 pl-4 pr-3">
          <span>{name !== null ? name : dataSourceName}</span>
        </td>
        <td className="whitespace-nowrap py-4 pl-4 pr-3">
          {getPhaseText() === "Mint" ? (
            <span>{`Mint until ${date.toLocaleString()}`}</span>
          ) : getPhaseText() === "No Contest Inevitable" ? (
            <span>{"Referee no show"}</span>
          ) : getPhaseText() === "No Contest" ? (
            <span>{"Referee no show"}</span>
          ) : (
            <span>{getPhaseText()}</span>
          )}
        </td>

        <td className="whitespace-nowrap py-4 pl-4 pr-3">
          <span>{fromWad4(treasuryAmount)} Ξ</span>
        </td>
        <td className="whitespace-nowrap py-4 pl-4 pr-3">
          {getPhaseText() === "No Contest Inevitable" ? (
            <span>{"Keep | Refund"}</span>
          ) : getPhaseText() === "No Contest" ? (
            <span>{"Keep | Refund"}</span>
          ) : getPhaseText() === "Scoring" ? (
            <span>{"Attest & Claim"}</span>
          ) : getPhaseText() === "Mint" ? (
            <span>{"Play | Refund"}</span>
          ) : getPhaseText() === "Refund" ? (
            <span>{"Keep | Refund"}</span>
          ) : getPhaseText() === "Countdown" ? (
            <span>{"Wait to play"}</span>
          ) : (
            <span>{getPhaseText()}</span>
          )}
        </td>
      </tr>
    </Link>
  );
};
