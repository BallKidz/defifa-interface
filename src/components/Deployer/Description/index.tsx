import styles from "./DeployerDescription.module.css";

const DeployerDescription = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gameplayContainer}>
        <p>Create flow consists of 2 steps:</p>

        <ul>
          <li className={styles.listItem}>
            <span className={styles.keywords}>Tournament setup:</span> In this
            step, gather all the required information for your tournament,
            including its name, as well as the dates for the mint period, refund
            period, and the start and end of the tournament.
          </li>
          <li className={styles.listItem}>
            <span className={styles.keywords}>NFT setup:</span> This step
            involves customizing NFTs for your tournament. Determine the price
            and set a fixed price for all tiers. Include artwork for the NFTs
            and set aside reserved NFTs for you as the creator.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DeployerDescription;
