import styles from "./BracketDescription.module.css";

const BracketDescription = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gameplayContainer}>
        <p>
          TLDR Gameplay: 1. Mint teams to load the pot. 2. The pot will back the
          value of the winning teams’ NFTs. 3. The spread of winning teams is
          determined by 60% of all teams agreeing on the outcome of the
          competition once it’s over.
        </p>
      </div>
      <div className={styles.infoContainer}>
        <p>
          Minting ends: <span>N/A</span>
        </p>
        <p>
          Trade deadline: <span>N/A</span>
        </p>
        <p>
          Game ends: <span>N/A</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default BracketDescription;
