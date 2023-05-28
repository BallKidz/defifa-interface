/* eslint-disable @next/next/no-img-element */
import Button from "components/UI/Button";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import { Games } from "hooks/useAllGames";
import { FC, useState } from "react";
import styles from "./Game.module.css";
import Link from "next/link";

const Game: FC<{game: Games;}> = ({ game }) => {
  // Hack for now to get the game name and id
  /* const { id, name } = game;
     console.log("Game id", id);
     console.log("Game name", name);
  */

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>
              {/* Fix types, add obj w keys, include more game stats */}
              <Link href={`/game/${game[0]}`}>
                <a>{game[0]}</a>
              </Link>
            </td>
            <td>
              <h3>{game[1]}</h3>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


export default Game;
