/* eslint-disable @next/next/no-img-element */
//nextjs Functional component

import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import useNftRewards from "../../hooks/NftRewards";
import { useNftRewardTiersOf } from "../../hooks/read/NftRewardsTiers";
import { useNextPhaseNeedsQueueing } from "../../hooks/read/PhaseNeedQueueing";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import useScorecardTable from "../../hooks/useScorecardData";
import { useMintReservesFor } from "../../hooks/write/useMintReservesFor";
import { useQueueNextPhase } from "../../hooks/write/useQueueNextPhase";
import Attestation from "../Attestation";
import ScoreCard from "../Scorecard";
import SimulatorCreate from "../Simulator/Simulate";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./SelfReferee.module.css";

const SelfRefree = () => {
  const { write, isLoading, isSuccess, isError } = useQueueNextPhase();
  const { data } = useProjectCurrentFundingCycle();

  const fundingCycle = data?.fundingCycle.number.toNumber();
  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiers ?? []
  );

  const { data: queueData, isLoading: nextPhaseNeedsQueueingLoading } =
    useNextPhaseNeedsQueueing();
  const {
    write: mintReserves,
    isLoading: mintReservesLoading,
    isSuccess: mintReservesSuccess,
    isError: mintReservesError,
    disabled: mintReservesDisabled,
  } = useMintReservesFor();
  let needsQueueing = queueData! as unknown as boolean;

  return (
    <Content title="Self-Refereeing" open={true}>
      <div className={styles.selfReferee}>
        <div className={styles.description}>
          <h3>
            Defifa relies on the integrity of a few transactions made by the
            game’s participants.
          </h3>
        </div>

        <div className={styles.tabsWrapper}>
          <Tabs forceRenderTabPanel defaultIndex={0}>
            <TabList>
              <Tab selectedClassName={styles.tabSelected}>Scorecard</Tab>
              <Tab selectedClassName={styles.tabSelected}>Mint reserves</Tab>
              <Tab selectedClassName={styles.tabSelected}>Queue phase</Tab>
            </TabList>
            <TabPanel>
              <div className={styles.description}>
                <h3>
                  Scorecard is mainly used for end-game aka end phase of the
                  game, players needs to be responsible for both processes
                  (submission & attestation)
                </h3>
                <p>
                  1.
                  <span style={{ color: "var(--gold)" }}>
                    Scorecard submission
                  </span>{" "}
                  processed is used for users to submit either defifa ballkids
                  scorecard or a custom one. Submission in lay term is you
                  deciding how treasury is going to be divided by assigning
                  points to all tiers
                </p>
                <p>
                  2.
                  <span style={{ color: "var(--gold)" }}>
                    Scorecard attestation
                  </span>{" "}
                  processed is used for users to submit either defifa ballkids
                  scorecard or a custom one. Submission in lay term is you
                  deciding how treasury is going to be divided by assigning
                  points to all tiers
                </p>
              </div>
              <Tabs forceRenderTabPanel>
                <TabList>
                  <Tab selectedClassName={styles.tabSelected}>
                    Scorecard submission
                  </Tab>
                  <Tab selectedClassName={styles.tabSelected}>
                    Scorecard attestation
                  </Tab>
                </TabList>
                <TabPanel>
                  <ScoreCard tiers={[]} />
                </TabPanel>
                <TabPanel>
                  <Attestation tiers={[]} />
                </TabPanel>
              </Tabs>
            </TabPanel>
            <TabPanel>
              <Button
                onClick={() => {
                  mintReserves?.();
                }}
                size="big"
                disabled={
                  mintReservesLoading ||
                  mintReservesSuccess ||
                  mintReservesDisabled ||
                  fundingCycle == 1 ||
                  fundingCycle === 2
                }
              >
                Mint Reserves
              </Button>
            </TabPanel>
            <TabPanel>
              <p>
                Each game phase must also be queued by someone in the public in
                a timely manner.
              </p>
              <Button
                onClick={() => {
                  write?.();
                }}
                size="big"
                disabled={
                  false || nextPhaseNeedsQueueingLoading || !needsQueueing
                }
              >
                {isLoading || nextPhaseNeedsQueueingLoading ? (
                  <img
                    style={{ marginTop: "5px" }}
                    src="/assets/defifa_spinner.gif"
                    alt="spinner"
                    width={35}
                  />
                ) : needsQueueing ? (
                  <span> Queue phase {fundingCycle + 1}</span>
                ) : (
                  <span> Phase {fundingCycle + 1} Already Queued</span>
                )}
              </Button>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </Content>
  );
};

export default SelfRefree;
