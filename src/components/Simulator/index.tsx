import { CurrentScore } from "../../hooks/read/CurrentScore";
import Content from "../UI/Content";
import SimulatorCreate from "./Simulate";
import styles from "./Simulator.module.css";

const SimulatorWrapper = () => {
  const data = CurrentScore();

  return (
    <Content title="Scorecard" open={data.length > 0}>
      <div className={styles.description}>
        <h3>Defifa Ballkids Scorecard</h3>
        <p>
          In a table below you will find an official defifa ballkids scorecard,
          the scorecard is primarily created using Google Sheets and is
          presented on the Defifa website for easy accessibility.
        </p>
      </div>
      <SimulatorCreate />
    </Content>
  );
};

export default SimulatorWrapper;
