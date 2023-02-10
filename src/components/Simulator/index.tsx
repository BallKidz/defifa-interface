import { CurrentScore } from "../../hooks/read/CurrentScore";
import Content from "../UI/Content";
import SimulatorCreate from "./Simulate";
import styles from "./Simulator.module.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Attestation from "../Attestation";

const SimulatorWrapper = () => {
  const data = CurrentScore();

  return (
    <Content title="Scorecard" open={data.length > 0}>
      <div className={styles.description}>
        <h3>
          Scorecard is mainly used for end-game aka end phase of the game,
          players needs to be responsible for both processes (submission &
          attestation)
        </h3>
        <p>
          1. Scorecard submission processed is used for users to submit either
          defifa ballkids scorecard or a custom one. Submission in lay term is
          you deciding how treasury is going to be divided by assigning points
          to all tiers
        </p>
        <p>
          2. Scorecard attestation processed is used for users to submit either
          defifa ballkids scorecard or a custom one. Submission in lay term is
          you deciding how treasury is going to be divided by assigning points
          to all tiers
        </p>
      </div>
      <div className={styles.tabsWrapper}>
        <Tabs>
          <TabList>
            <Tab selectedClassName={styles.tabSelected}>Submission</Tab>
            <Tab selectedClassName={styles.tabSelected}>Attestation</Tab>
          </TabList>
          <TabPanel>
            <div className={styles.description}>
              <h3>Defifa Ballkids Scorecard</h3>
              <p>
                In a table below you will find an unofficial defifa ballkids
                scorecard, the scorecard is primarily created using Google
                Sheets and is presented on the Defifa website for easy
                accessibility.
              </p>
            </div>
            <SimulatorCreate />
          </TabPanel>
          <TabPanel>
            <Attestation tiers={[]} />
          </TabPanel>
        </Tabs>
      </div>
    </Content>
  );
};

export default SimulatorWrapper;
