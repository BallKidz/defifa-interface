import Button from "components/UI/Button";
import Content from "components/UI/Content";
import useNftRewards from "hooks/NftRewards";
import { useNftRewardTiersOf } from "hooks/read/NftRewardsTiers";
import { useNextPhaseNeedsQueueing } from "hooks/read/PhaseNeedQueueing";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import { useFetchGovernor } from "hooks/read/useFetchGovernor";
import { useMintReservesFor } from "hooks/write/useMintReservesFor";
import { useQueueNextPhase } from "hooks/write/useQueueNextPhase";
import Image from "next/image";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Attestation from "../Attestation";
import ScoreCard from "../Scorecard";
import styles from "./SelfReferee.module.css";

const SelfReferee = () => {
  const { write, isLoading, isSuccess, isError } = useQueueNextPhase();
  const { data } = useProjectCurrentFundingCycle();

  const fundingCycle = data?.fundingCycle.number.toNumber();
  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);
  const { data: governor } = useFetchGovernor(data?.metadata.dataSource);
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiers ?? []
  );
  const [selectedTab, setSelectedTab] = useState(0);

  const { data: queueData, isLoading: nextPhaseNeedsQueueingLoading } =
    useNextPhaseNeedsQueueing();
  const {
    write: mintReserves,
    isLoading: mintReservesLoading,
    isSuccess: mintReservesSuccess,
    isError: mintReservesError,
    disabled: mintReservesDisabled,
  } = useMintReservesFor(false, data?.metadata.dataSource);
  let needsQueueing = queueData! as unknown as boolean;

  const handleTabClick = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <Content title="Referee" open={true}>
      <div className={styles.selfReferee}>
        <div className={styles.description}>
          <h3>
            Defifa relies on the integrity of a few transactions made by the
            game’s participants.
          </h3>
        </div>

        <div className={styles.tabsWrapper}>
          <Tabs
            forceRenderTabPanel
            onSelect={handleTabClick}
            selectedIndex={selectedTab}
          >
            <TabList>
              <Tab selectedClassName={styles.tabSelected}>
                Scorecard attestation
              </Tab>
              <Tab selectedClassName={styles.tabSelected}>
                Scorecard submission
              </Tab>
              <Tab selectedClassName={styles.tabSelected}>Queue phase</Tab>
              <Tab selectedClassName={styles.tabSelected}>Mint reserves</Tab>
            </TabList>
            <TabPanel>
              <Attestation
                dataSource={data?.metadata.dataSource}
                tiers={rewardTiers as []}
                onScoreCardSubmission={() => handleTabClick(1)}
              />
            </TabPanel>
            <TabPanel>
              <ScoreCard
                tiers={rewardTiers as []}
                governor={governor?.toString() ?? ""}
              />
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
                  <Image
                    style={{ marginTop: "5px" }}
                    src="/assets/defifa_spinner.gif"
                    alt="spinner"
                    width={35}
                    height={35}
                  />
                ) : needsQueueing ? (
                  <span> Queue phase {fundingCycle + 1}</span>
                ) : (
                  <span> Phase {fundingCycle + 1} Already Queued</span>
                )}
              </Button>
            </TabPanel>
            <TabPanel>
              <p>Mint reserved tokens for all tiers.</p>
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
          </Tabs>
        </div>
      </div>
    </Content>
  );
};

export default SelfReferee;
