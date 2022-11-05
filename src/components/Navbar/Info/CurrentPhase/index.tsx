import { useMemo } from "react";
import { useProjectCurrentFundingCycle } from "../../../../hooks/read/ProjectCurrentFundingCycle";
import styles from "./CurrentPhase.module.css";

const CurrentPhase = () => {
  const { data } = useProjectCurrentFundingCycle();

  const phase = (fc: number) => {
    if (fc === 1) {
      return "mint";
    } else if (fc === 2) {
      return "start";
    } else if (fc === 3) {
      return "trade deadline";
    } else {
      return "end";
    }
  };

  return (
    <div className={styles.container}>
      <h1>
        phase {data?.fundingCycle.number.toNumber()}:{" "}
        {phase(data?.fundingCycle.number.toNumber())}
      </h1>
      <p>current game phase</p>
    </div>
  );
};

export default CurrentPhase;
