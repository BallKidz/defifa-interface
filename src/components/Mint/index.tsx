import { useState } from "react";
import { ETH_TOKEN_ADDRESS } from "../../constants/addresses";
import { colors } from "../../constants/colors";
import { DEFIFA_PROJECT_ID_GOERLI } from "../../constants/constants";
import { usePay } from "../../hooks/write/usePay";
import Group from "../Group";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./Mint.module.css";
import SortSelect from "./SortSelect/SortSelect";
const Mint = () => {
  const [tierIds, setTierIds] = useState<number[]>([]);

  const { data, write, isLoading, isSuccess } = usePay({
    amount: "0",
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
