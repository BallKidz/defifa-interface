import { useScoringOpen } from "components/GameDashboard/MyTeams/MyTeam/useScoringOpen";
import Button from "components/UI/Button";
import Content from "components/UI/Content";
import useNftRewards from "hooks/NftRewards";
import { useNftRewardTiersOf } from "hooks/read/NftRewardsTiers";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import { useFetchGovernor } from "hooks/read/useFetchGovernor";
import { useMintReservesFor } from "hooks/write/useMintReservesFor";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Attestation from "./Attestation";
import ScoreCard from "./Scorecard";
import styles from "./SelfReferee.module.css";
import { useGameContext } from "contexts/GameContext";

const SelfReferee = () => {
  const { gameId } = useGameContext();
  const { data } = useProjectCurrentFundingCycle(gameId);

  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);
  const { data: governor } = useFetchGovernor(data?.metadata.dataSource);
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiers ?? []
  );
  const scoringOpen = useScoringOpen();
  const {
    write: mintReserves,
    isLoading: mintReservesLoading,
    isSuccess: mintReservesSuccess,
    isError: mintReservesError,
    disabled: mintReservesDisabled,
  } = useMintReservesFor(false, data?.metadata.dataSource);

  const [selectedTab, setSelectedTab] = useState(0);

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
              <p>Mint reserved tokens for all tiers.</p>
              <Button
                onClick={() => {
                  mintReserves?.();
                }}
                disabled={
                  mintReservesLoading ||
                  mintReservesSuccess ||
                  mintReservesDisabled ||
                  scoringOpen
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
