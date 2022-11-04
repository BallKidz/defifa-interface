import { BigNumber } from "ethers";
import { chunk } from "lodash";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
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
  const [selectAll, setSelectAll] = useState<boolean>(false);

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

  useEffect(() => {
    if (isSuccess) {
      setTierIds([]);
    }
  }, [isSuccess]);

  const onTeamSelected = (id: number) => {
    if (tierIds.includes(id)) {
      const filtered = tierIds.filter((i) => i !== id);
      setTierIds(filtered);
    } else {
      setTierIds([...tierIds, id]);
    }
  };

  const onSelectAllTeams = () => {
    setTierIds(Array.from({ length: 32 }, (_, i) => i + 1));
    setSelectAll(true);
  };

  const onUnselectAllTeams = () => {
    setTierIds([]);
    setSelectAll(false);
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
                disabled={
                  !isConnected || isLoading || !tierIds.length ? true : false
                }
                onClick={() => {
                  write?.();
                }}
              >
                {isLoading ? (
                  <ThreeDots
                    height="10"
                    width="800"
                    radius="5"
                    color="#ff"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    visible={true}
                  />
                ) : (
                  <span>MINT {tierIds.length ? tierIds.length : ""}</span>
                )}
              </Button>
            </div>
          </div>
          <div className={styles.selectAllWrapper}>
            <button className={styles.selectAll} onClick={onSelectAllTeams}>
              {" "}
              SELECT ALL{" "}
            </button>
            <button
              className={styles.selectAll}
              onClick={onUnselectAllTeams}
              style={{ display: tierIds.length ? "block" : "none" }}
            >
              UNSELECT{" "}
              {tierIds.length === tiers?.length ? "ALL" : tierIds.length}{" "}
            </button>
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
                    txSuccess={isSuccess}
                    selectAll={selectAll}
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
