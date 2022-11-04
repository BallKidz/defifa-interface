import { BigNumber } from "ethers";
import { chunk } from "lodash";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ETH_TOKEN_ADDRESS } from "../../constants/addresses";
import { MINT_PRICE } from "../../constants/constants";
import useNftRewards from "../../hooks/NftRewards";
import { useProjectCurrentFundingCycle } from "../../hooks/read/useJBMProjectCurrentConfCycle";
import { useNftRewardTiersOf } from "../../hooks/read/useTiers";
import { usePay } from "../../hooks/write/usePay";
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

  const { write, isLoading, isSuccess } = usePay({
    amount: BigNumber.from(MINT_PRICE).mul(`${tierIds.length}`).toString(),
    token: ETH_TOKEN_ADDRESS,
    minReturnedTokens: "0",
    preferClaimedTokens: true,
    memo: "",
    metadata: {
      dontMint: false,
      expectMintFromExtraFunds: false,
      dontOvespend: false,
      tierIdsToMint: tierIds,
    },
  });

  const onTeamSelected = (id: number) => {
    if (tierIds.includes(id)) {
      const filtered = tierIds.filter((i) => i !== id);
      setTierIds(filtered);
    } else {
      setTierIds([...tierIds, id]);
    }
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
            {chunkedRewardTiers.map((tiers: any, index: any) => (
              <Group
                groupName={`GROUP ${String.fromCharCode(97 + index)}`}
                key={String.fromCharCode(97 + index)}
              >
                {tiers.map((t: any) => (
                  <Team
                    key={t.id}
                    id={t.id}
                    img={t.teamImage}
                    name={t.teamName}
                    minted={t.minted}
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
