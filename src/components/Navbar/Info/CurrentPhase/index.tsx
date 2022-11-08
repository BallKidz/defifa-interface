import { useProjectCurrentFundingCycle } from "../../../../hooks/read/ProjectCurrentFundingCycle";
import styles from "./CurrentPhase.module.css";

const CurrentPhase = () => {
  const { data } = useProjectCurrentFundingCycle();

  const phase = (fc: number) => {
    if (fc === 1) {
      return "Mint";
    } else if (fc === 2) {
      return "Start";
    } else if (fc === 3) {
      return "Trade deadline";
    } else if (fc === 4) {
      return "End";
    } else {
      return "Mint begins soon";
    }
  };

  return (
    <div className={styles.container}>
      <h1>
        Phase {data?.fundingCycle.number.toNumber()}:{" "}
        {phase(data?.fundingCycle.number.toNumber())}
      </h1>
      <p>Current game phase</p>
    </div>
  );
};

export default CurrentPhase;
