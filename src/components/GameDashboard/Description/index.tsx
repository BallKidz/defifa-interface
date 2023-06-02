/* eslint-disable react/no-unescaped-entities */
import { useGameContext } from "contexts/GameContext";
import { useGameMetadata } from "hooks/read/GameMetadata";
import CurrentPhase from "../../Navbar/Info/CurrentPhase";
import Treasury from "../../Navbar/Info/Treasury";
import Rules from "../Rules";
import styles from "./Description.module.css";

const Description = () => {
  const { gameId } = useGameContext();
  const { data, isLoading } = useGameMetadata(gameId);

  return (
    <div>
      {!isLoading && data ? (
        <h1 className="text-3xl mb-8">{data?.name}</h1>
      ) : (
        <>Loading...</>
      )}

      <Treasury />

      <div className="my-5">
        <h1 className="text-xl mb-3">How to play:</h1>
        <ol className="flex flex-col gap-2">
          <li>
            <span style={{ color: "white" }}>Play: </span>Mint NFTs with ETH.
            Your ETH is added to the total pot.
          </li>
          <li>
            <span style={{ color: "white" }}>Manage: </span>The pot backs the
            value of the winning NFTs.
          </li>
          <li>
            <span style={{ color: "white" }}>Referee: </span>NFT holders attest
            to the game's result.
          </li>
        </ol>
      </div>

      <Rules />
    </div>
  );
};

export default Description;
