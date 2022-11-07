import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber } from "ethers";
import { chunk } from "lodash";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ETH_TOKEN_ADDRESS } from "../../constants/addresses";
import { MINT_PRICE } from "../../constants/constants";
import useNftRewards from "../../hooks/NftRewards";
import { useNftRewardTiersOf } from "../../hooks/read/NftRewardsTiers";
import { useNftRewardsTotalSupply } from "../../hooks/read/NftRewardsTotalSupply";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { usePay } from "../../hooks/write/usePay";
import Group from "../Group";
import Team from "../Team";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./Mint.module.css";
import SortSelect from "./SortSelect/SortSelect";

const Mint = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data } = useProjectCurrentFundingCycle();
  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiers ?? []
  );
  const { data: totalSupply } = useNftRewardsTotalSupply();
  const [tierIds, setTierIds] = useState<number[]>([]);

  const [sortOption, setSortOption] = useState<string>("group");
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const chunkedRewardTiers = chunk(rewardTiers, 4);
  const mostMintedRewardTiers = rewardTiers
    ?.slice()
    .sort(
      (a: { minted: number }, b: { minted: number }) => b.minted - a.minted
    );

  const { write, isLoading, isSuccess, isError } = usePay({
    amount: BigNumber.from(MINT_PRICE).mul(`${tierIds.length}`).toString(),
    token: ETH_TOKEN_ADDRESS,
    minReturnedTokens: "0",
    preferClaimedTokens: true,
    memo: `Minted on defifa.net`,
    metadata: {
      dontMint: false,
      expectMintFromExtraFunds: false,
      dontOvespend: false,
      tierIdsToMint: tierIds,
    },
  });

  useEffect(() => {
    if (isSuccess || isError) {
      setTierIds([]);
    }
  }, [isError, isSuccess]);

  const onTeamSelected = (id: number) => {
    if (tierIds.includes(id)) {
      const filtered = tierIds.filter((i) => i !== id);
      setTierIds(filtered);
    } else {
      setTierIds([...tierIds, id]);
    }
  };

  const onSelectAllTeams = () => {
    setTierIds(Array.from({ length: tiers?.length ?? 0 }, (_, i) => i + 1));
    setSelectAll(true);
  };

  const onUnselectAllTeams = () => {
    setTierIds([]);
    setSelectAll(false);
  };

  const onSortChange = (option: string) => {
    setSortOption(option);
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
              # MINTS: <b>{totalSupply?.toNumber()} so far</b>{" "}
            </div>

            <div className={styles.sortSelectWrapper}>
              <SortSelect onChange={onSortChange} />
            </div>

            <div className={styles.buttonWrapper}>
              <Button
                disabled={isLoading || !tierIds.length ? true : false}
                onClick={() => {
                  if (!isConnected) {
                    openConnectModal!();
                  } else {
                    write?.();
                  }
                }}
              >
                {isLoading ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    style={{ marginTop: "5px" }}
                    src="/assets/defifa_spinner.gif"
                    alt="spinner"
                    width={35}
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
              style={{
                display: tierIds.length === tiers?.length ? "block" : "none",
              }}
            >
              UNSELECT ALL
            </button>
          </div>
          <div
            className={
              sortOption === "group"
                ? styles.groupsContainer
                : styles.mostMintContainer
            }
          >
            {sortOption === "group"
              ? chunkedRewardTiers.map((tiers: any, index: any) => (
                  <Group
                    groupName={`GROUP ${String.fromCharCode(97 + index)}`}
                    key={index}
                  >
                    {tiers.map((t: any) => (
                      <Team
                        key={t.id}
                        id={t.id}
                        img={t.teamImage}
                        name={t.teamName}
                        minted={t.minted}
                        supply={totalSupply?.toNumber() ?? 0}
                        txState={isSuccess || isError}
                        selectAll={selectAll}
                        onClick={onTeamSelected}
                      />
                    ))}
                  </Group>
                ))
              : mostMintedRewardTiers?.map((t: any) => (
                  <Team
                    key={t.id}
                    id={t.id}
                    img={t.teamImage}
                    name={t.teamName}
                    minted={t.minted}
                    supply={totalSupply?.toNumber() ?? 0}
                    txState={isSuccess || isError}
                    selectAll={selectAll}
                    onClick={onTeamSelected}
                  />
                ))}
          </div>
        </div>
      </Content>
    </>
  );
};

export default Mint;
