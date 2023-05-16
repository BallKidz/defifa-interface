/* eslint-disable react/no-unescaped-entities */
import CurrentPhase from "../Navbar/Info/CurrentPhase";
import Treasury from "../Navbar/Info/Treasury";
import Rules from "../Rules";
import Title from "../Title";
import styles from "./Description.module.css";

const Description = () => {
  return (
    <div className={styles.container}>
      <Title title="DEFIFA: Lakers v Nuggets - Game 1" />
      <Title title="Pick winner and # of scorers with > 29.5 points" /> 
      <Treasury />
      <div className={styles.gameplayContainer}>
        <h1 className={styles.gameplayHeader}>Onchain gameplay:</h1>
        <ol>
          <li><span style={{ color: "white" }}>Play: </span>Mint NFTs to load the pot.</li>
          <li><span style={{ color: "white" }}>Manage: </span>The pot backs the value of the winning NFTs.</li>
          <li><span style={{ color: "white" }}>Referee: </span>NFT holders themselves determing the winners.</li>
        </ol>
      </div>
      <Rules />
      <CurrentPhase />
    </div>
  );
};

export default Description;
