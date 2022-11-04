import useNftRewards from "../../hooks/NftRewards";
import { useProjectCurrentFundingCycle } from "../../hooks/read/useJBMProjectCurrentConfCycle";
import { useNftRewardTiersOf } from "../../hooks/read/useTiers";
import { decodeEncodedIPFSUri } from "../../utils/ipfs";
import { CIDsOfNftRewardTiersResponse } from "../../utils/nftRewards";
import Group from "../Group";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./Mint.module.css";
import SortSelect from "./SortSelect/SortSelect";
const Mint = () => {
  const { data } = useProjectCurrentFundingCycle({ projectId: 116 });
  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);
  let CIDs: string[] = [];

  if (tiers) {
    CIDs = CIDsOfNftRewardTiersResponse(tiers);
  }

  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiers ?? []
  );

  return (
    <>
      <Content title="MINT TEAMS [WORK IN PROGRESS]" open={true}>
        <div className={styles.mint}>
          <div className={styles.mintHeader}>
            <div className={styles.subtitle}>
              PLAY: <b>0.022 ETH / NFT</b>{" "}
            </div>

            <div className={styles.subtitle}>
              # PLAYERS: <b>69 so far</b>{" "}
            </div>

            <div className={styles.sortSelectWrapper}>
              <SortSelect />
            </div>

            <div className={styles.buttonWrapper}>
              <Button onClick={() => {}}>MINT 13</Button>
            </div>
          </div>
          <div className={styles.selectAllWrapper}>
            <button className={styles.selectAll}> SELECT ALL </button>
          </div>
          <div className={styles.groupsContainer}>
            <Group groupName="A" />
            <Group groupName="B" />
          </div>
        </div>
      </Content>
    </>
  );
};

export default Mint;
