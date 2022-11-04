import { chunk } from "lodash";
import { useState } from "react";
import { useAccount } from "wagmi";
import useNftRewards from "../../hooks/NftRewards";
import { useProjectCurrentFundingCycle } from "../../hooks/read/useJBMProjectCurrentConfCycle";
import { useNftRewardTiersOf } from "../../hooks/read/useTiers";
import Group from "../Group";
import Team from "../Team";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./Mint.module.css";
import SortSelect from "./SortSelect/SortSelect";

const Mint = () => {
  const { isConnected } = useAccount();
  const [tierIds, setTierIds] = useState<number[]>([]);
  const { data } = useProjectCurrentFundingCycle({ projectId: 116 });
  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);

  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiers ?? []
  );

  const chunkedRewardTiers = chunk(rewardTiers, 4);

  // const { data, write, isLoading, isSuccess } = usePay({
  //   amount: "0",
  //   token: ETH_TOKEN_ADDRESS,
  //   minReturnedTokens: "0",
  //   preferClaimedTokens: true,
  //   memo: "",
  //   metadata: {
  //     dontMint: false,
  //     expectMintFromExtraFunds: false,
  //     dontOvespend: false,
  //     tierIdsToMint: tierIds,
  //   },
  // });

  const onTeamSelected = (id: number) => {
    setTierIds([...tierIds, id]);
  };

  return (
    <>
      <Content title="MINT TEAMS" open={true}>
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
              <Button
                disabled={!isConnected ? true : false}
                onClick={() => {
                  write?.();
                }}
              >
                MINT {tierIds.length}
              </Button>
            </div>
          </div>
          <div className={styles.selectAllWrapper}>
            <button className={styles.selectAll}> SELECT ALL </button>
          </div>
          <div className={styles.groupsContainer}>
            {chunkedRewardTiers.map((tiers, index) => (
              <Group
                groupName={`GROUP ${String.fromCharCode(97 + index)}`}
                key={Math.random()}
              >
                {tiers.map((t) => (
                  <Team
                    id={t.id}
                    img={t.teamImage}
                    name={t.teamName}
                    key={t.id}
                    supply={t.maxSupply}
                    onClick={onTeamSelected}
                  />
                ))}
              </Group>
            ))}
          </div>
        </div>
      </Content>
    </>
  );
};

export default Mint;
