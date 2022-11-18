/* eslint-disable react/no-unescaped-entities */
import { useCountdown } from "../../hooks/Countdown";
import { useDeployerDates } from "../../hooks/read/DeployerDates";
import { useDeployerDuration } from "../../hooks/read/DeployerDuration";
import styles from "./Description.module.css";

const Description = () => {
  const deployerDuration = useDeployerDuration();
  const { end, tradeDeadline } = useDeployerDates("utc");
  const formatted = useCountdown({
    eventTime: deployerDuration?.start,
    interval: 1000,
  });

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <p>
          Minting ends & game starts:{" "}
          <span className={styles.infoDates}>{formatted}</span>
        </p>
        <p>
          Trade deadline:{" "}
          <span className={styles.infoDates}>{tradeDeadline.date}</span>
        </p>
        <p>
          Game ends: <span className={styles.infoDates}>{end.date}</span>{" "}
        </p>
      </div>
      <div className={styles.gameplayContainer}>
        <h1 className={styles.gameplayHeader}>TLDR Gameplay:</h1>
        <ol>
          <li>Mint teams to load the pot.</li>
          <li>The pot will back the value of the winning team's NFTs.</li>
          <li>
            The spread of winning teams is determined by 50% of all teams
            agreeing on the outcome of the competition once it's over.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Description;
