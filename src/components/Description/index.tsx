/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useDeployerDuration } from "../../hooks/read/DeployerDuration";
import { formatDateToUTC } from "../../utils/format/formatDate";
import styles from "./Description.module.css";

type DescriptionDates = {
  start: string;
  tradeDeadline: string;
  end: string;
};

const Description = () => {
  const { data } = useDeployerDuration();
  const [dates, setDates] = useState<DescriptionDates>();

  useEffect(() => {
    if (!data) return;

    setDates({
      start: formatDateToUTC(data.start * 1000),
      tradeDeadline: formatDateToUTC(data.tradeDeadline * 1000),
      end: formatDateToUTC(data.end * 1000),
    });
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <p>
          Minting ends & game starts:{" "}
          <span className={styles.infoDates}>{dates?.start}</span>
        </p>
        <p>
          Trade deadline:{" "}
          <span className={styles.infoDates}>{dates?.tradeDeadline}</span>
        </p>
        <p>
          Game ends: <span className={styles.infoDates}>{dates?.end}</span>{" "}
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
