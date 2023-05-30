import { Games } from "hooks/useAllGames";
import Link from "next/link";
import { FC } from "react";
import styles from "./Game.module.css";

const Game: FC<{ game: Games }> = ({ game }) => {
  const { gameId, name, address } = game;
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>
              {/* TODO: include more game stats */}
              <Link href={`/game/${gameId}`}>{gameId}</Link>
            </td>
            <td>
              <h3>{name !== null ? name : "No name set in metadata"}</h3>
            </td>
            <td>
              <h3>{address}</h3>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Game;
