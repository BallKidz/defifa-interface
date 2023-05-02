import { useEffect, useMemo, useState } from "react";
import { useCountdown } from "../../../../hooks/Countdown";
import { useDeployerDates } from "../../../../hooks/read/DeployerDates";
import { useDeployerDuration } from "../../../../hooks/read/DeployerDuration";
import { useProjectCurrentFundingCycle } from "../../../../hooks/read/ProjectCurrentFundingCycle";
import {
  formatMillistoMoment,
  formatSecondsToMoment,
} from "../../../../utils/format/formatDate";
import Content from "../../../UI/Content";
import styles from "./CurrentPhase.module.css";

const CurrentPhase = () => {
  const { data } = useProjectCurrentFundingCycle();
  const deployerDuration = useDeployerDuration();
  const { refundPeriodDuration, start, end } = useDeployerDates("local");

  const fundingCycle = data?.fundingCycle.number.toNumber();
  const [countdownDate, setCountdownDate] = useState<Date>();
  const { timeRemaining } = useCountdown(countdownDate);
  const [titleTimeRemaining, setTitleTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!fundingCycle || !deployerDuration) return;

    const { refundPeriodDuration, start } = deployerDuration;

    switch (fundingCycle) {
      case 1:
        setCountdownDate(
          formatSecondsToMoment(refundPeriodDuration, start).toDate()
        );
        setTitleTimeRemaining(`Minting ends in`);
        break;
      case 2:
        setCountdownDate(formatMillistoMoment(start).toDate());
        setTitleTimeRemaining(`Refunding ends in`);
        break;
      case 3:
        setCountdownDate(new Date());
        setTitleTimeRemaining(`Game ends`);
        break;
      case 4:
        setCountdownDate(new Date());
        setTitleTimeRemaining(`Game over`);
        break;
      default:
        setTitleTimeRemaining("");
        break;
    }
  }, [fundingCycle, deployerDuration]);

  const dateCollapsibleTitle = useMemo(() => {
    return timeRemaining
      ? `${titleTimeRemaining} ${timeRemaining}`
      : `${titleTimeRemaining}: ${end.date}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Current phase</h1>
      <p style={{ fontSize: "16px" }}>{dateCollapsibleTitle}</p>
      {titleTimeRemaining && (
        <Content
          title={`Phases`}
          fontSize="16"
          color="var(--violet)"
        >
          <div className={styles.dateInfoContainer}>
            <p>
              Mint ends:{" "}
              <span className={styles.infoDates}>
                {refundPeriodDuration.date}
              </span>
            </p>
            <p>
              Refund ends:{" "}
              <span className={styles.infoDates}>{start.date}</span>
            </p>
            <p>
              Game starts:{" "}
              <span className={styles.infoDates}>{start.date}</span>
            </p>
            <p>
              Game ends: <span className={styles.infoDates}>{end.date}</span>{" "}
            </p>
          </div>
        </Content>
      )}
    </div>
  );
};

export default CurrentPhase;
