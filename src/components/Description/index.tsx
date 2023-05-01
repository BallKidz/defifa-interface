/* eslint-disable react/no-unescaped-entities */
import CurrentPhase from "../Navbar/Info/CurrentPhase";
import Treasury from "../Navbar/Info/Treasury";
import Rules from "../Rules";
import Title from "../Title";
import styles from "./Description.module.css";

const Description = () => {
  return (
    <div className={styles.container}>
      <Title title="Defifa: American Basketball Playoffs 2023 edition" />
      <Treasury />
      <CurrentPhase />
      <div className={styles.gameplayContainer}>
        <h1 className={styles.gameplayHeader}>TLDR Gameplay:</h1>
        <ol>
          <li>Mint teams to load the pot.</li>
          <li>The pot will back the value of the winning team's NFTs.</li>
          <li>
            The payout for the winning teams is determined by 50% of all teams
            agreeing on the outcome of the competition once it's over.
          </li>
        </ol>
      </div>
      <Rules />
    </div>
  );
};

export default Description;
