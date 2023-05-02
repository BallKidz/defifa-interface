/* eslint-disable react/no-unescaped-entities */
import CurrentPhase from "../Navbar/Info/CurrentPhase";
import Treasury from "../Navbar/Info/Treasury";
import Rules from "../Rules";
import Title from "../Title";
import styles from "./Description.module.css";

const Description = () => {
  return (
    <div className={styles.container}>
      <Title title="DEFIFA: Warriors v Lakers 2023 Playoffs" />
      <Treasury />
      <CurrentPhase />
      <div className={styles.gameplayContainer}>
        <h1 className={styles.gameplayHeader}>Onchain gameplay:</h1>
        <ol>
          <li>Play: Mint NFTs to load the pot.</li>
          <li>Manage: The pot backs the value of the winning NFTs.</li>
          <li>Referee: NFT holders themselves determing the winners.</li>
        </ol>
      </div>
      <Rules />
    </div>
  );
};

export default Description;
