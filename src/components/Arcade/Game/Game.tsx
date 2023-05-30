import { Games } from "hooks/useAllGames";
import Link from "next/link";
import { FC } from "react";

export const GameRow: FC<{ game: Games }> = ({ game }) => {
  const { gameId, name, address } = game;
  return (
    <tr className="text-sm">
      <td className="whitespace-nowrap py-4 pl-4 pr-3">
        {/* TODO: include more game stats */}
        <Link href={`/game/${gameId}`}>{gameId}</Link>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3">
        <span>{name !== null ? name : "No name set in metadata"}</span>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3">
        <span>{address}</span>
      </td>
    </tr>
  );
};
