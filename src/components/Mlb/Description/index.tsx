import styles from "./MlbDescription.module.css";

const MlbDescription = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gameplayContainer}>
        <p>Collect playing cards, determine outcomes, earn ownership:</p>

        <ol>
          <li className={styles.listItem}>
            <span className={styles.keywords}>Collect:</span> Pick to fill the game pot. A portion is reserved for artists and
            creators.
          </li>
          <li className={styles.listItem}>
            <span className={styles.keywords}>Earn:</span> The pot backs the
            value of the winning NFTs. Creators and players earn governance
            tokens.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default MlbDescription;
