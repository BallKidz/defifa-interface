/* eslint-disable @next/next/no-img-element */
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Button from "components/UI/Button";
import Content from "components/UI/Content";
import { Input } from "components/UI/Input";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import { MINT_PRICE } from "constants/constants";
import { BigNumber, ethers } from "ethers";
import useNftRewards from "hooks/NftRewards";
import { useNftRewardTiersOf } from "hooks/read/NftRewardsTiers";
import { useNftRewardsTotalSupply } from "hooks/read/NftRewardsTotalSupply";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import { usePay } from "hooks/write/usePay";
import { useState } from "react";
import { useAccount } from "wagmi";
import Team from "../../Team";
import styles from "./Mint.module.css";

function isValidAddress(delegate: string) {
  return ethers.utils.isAddress(delegate);
}

const Mint = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data } = useProjectCurrentFundingCycle();
  const currentFcNumber = data?.fundingCycle.number.toNumber();
  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiers ?? []
  );

  const { data: totalSupply } = useNftRewardsTotalSupply(
    data?.metadata.dataSource
  );

  const [tierIds, setTierIds] = useState<number[]>([]);
  const [imgMemo, setImgMemo] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [referee, setReferee] = useState<string>(
    "0xa13d49fCbf79EAF6A0a58cBDD3361422DB4eAfF1"
  );

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
    memo: `Minted on defifa.net ${imgMemo}`,
    metadata: {
      _votingDelegate: referee, //"0xa13d49fCbf79EAF6A0a58cBDD3361422DB4eAfF1", //?? who's is this?
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

  const onAddMultipleTeams = (id: number) => {
    setTierIds([...tierIds, id]);
  };

  const onRemoveMultipleTeams = (id: number) => {
    const index = tierIds.indexOf(id);

    if (index > -1) {
      const nextState = [...tierIds];
      nextState.splice(index, 1);
      setTierIds(nextState);
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

  const onRefereeDelegate = (e: any) => {
    const delegate = e.target.value;
    console.log("delegate ", delegate);

    if (isValidAddress(delegate)) {
      setReferee(delegate);
    } else {
      setReferee(delegate);
    }
  };

  return (
    <>
      <Content title="Play" open={true}>
        <div className={styles.mint}>
          <div
            className={styles.mintHeader}
            style={{
              gridTemplateColumns:
                currentFcNumber === 1 ? "repeat(3, auto)" : "repeat(3, auto)",
            }}
          >
            <div className={styles.subtitle}>
              Price: <span>0.01 ETH / NFT</span>
            </div>

            <div className={styles.subtitle}>
              Mints: <span>{totalSupply?.toNumber()}</span>
            </div>
            {currentFcNumber === 1 && (
              <>
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
                      <img
                        style={{ marginTop: "5px" }}
                        src="/assets/defifa_spinner.gif"
                        alt="spinner"
                        width={35}
                      />
                    ) : (
                      <span>Mint {tierIds.length ? tierIds.length : ""}</span>
                    )}
                  </Button>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="delegate" className={styles.label}>
                    Delegate Referee
                  </label>
                  <span>
                    <Input
                      type="text"
                      id="delegate"
                      value={referee}
                      name="delegate"
                      onChange={(e) => onRefereeDelegate(e)}
                    />
                  </span>
                </div>
              </>
            )}
          </div>
          {currentFcNumber === 1 && (
            <div className={styles.selectAllWrapper}>
              <button className={styles.selectAll} onClick={onSelectAllTeams}>
                Select all
              </button>
              <button
                className={styles.selectAll}
                onClick={onUnselectAllTeams}
                style={{
                  display: tierIds.length === tiers?.length ? "block" : "none",
                }}
              >
                Unselect all
              </button>
            </div>
          )}

          <div
            style={{ pointerEvents: currentFcNumber === 1 ? "auto" : "none" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {mostMintedRewardTiers?.map((t: any) => (
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
                onAddMultiple={onAddMultipleTeams}
                onRemoveMultiple={onRemoveMultipleTeams}
              />
            ))}
          </div>
        </div>
      </Content>
    </>
  );
};

export default Mint;