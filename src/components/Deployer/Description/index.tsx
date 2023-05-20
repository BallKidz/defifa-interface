import styles from "./DeployerDescription.module.css";

const DeployerDescription = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gameplayContainer}>
        <p>Create a new Defifa game in 2 steps:</p>

        <ol>
          <li className={styles.listItem}>
            <span className={styles.keywords}>Game Setup:</span> Add details
            about your game.
          </li>
          <li className={styles.listItem}>
            <span className={styles.keywords}>NFT Setup:</span> Customize your
            game&apos;s NFTs. Set their price, and set a fixed price for all
            tiers. Add NFT artwork and set aside reserved NFTs for you, the
            creator.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default DeployerDescription;
