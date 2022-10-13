//nextjs Functional component

import React from "react";
import Content from "../UI/Content";
import styles from "./index.module.css";

const Rules = () => {
  return (
    <>
      <Content title="RULES">
      <div className={styles.phases}>
        <div className={styles.phaseBox}>
          <h1>PHASE 1: MINT</h1>
          <p>
            THERE ARE 32 TEAMS REPRESENTING THE NATIONS COMPETING AT THE 2022
            FIFA WORLD CUP.
            <br />
            <br />
            MINT TEAM NFTS TO INCREASE THE GAME’S TREASURY.
            <br />
            <br />
            THE NFT’S ARE A CLAIM ON THIS TREASURY. <br />
            <br />
            YOU CAN GET A FULL REFUND ANYTIME BEFORE THE GAME STARTS.
          </p>
        </div>
        <div className={styles.phaseBox}>
          <h1>PHASE 2: START</h1>
          <p>
            THE TREASURY IS LOCKED AND MINTING PERMENENTLY ENDS BEFORE THE FIRST
            KICKOFF ON NOVEMBER 20, 2022.
            <br />
            <br />
            HOLDERS OF EACH TEAM’S NFTS BENEFIT FROM THE OUTCOME OF EACH WORLD
            CUP GAME THEIR TEAM PLAYS.
            <br />
            <br />
            THE EVENTUAL VALUE OF THEIR NFTS RECALIBRATES DEPENDING ON THE
            OUTCOME.*
          </p>
        </div>
        <div className={styles.phaseBox}>
          <h1>PHASE 3: TRADE DEADLINE</h1>
          <p>
            NFTS ARE NOT TRANSFERABLE FROM THE TRADE DEADLINE UNTIL THE GAME’S
            END.
            <br />
            <br />
            THE TRADE DEADLINE COINCIDES WITH THE START OF THE KNOCK-OUT STAGE.
          </p>
        </div>
        <div className={styles.phaseBox}>
          <h1>PHASE 4: END</h1>
          <p>
            THE GAME IS SELF REFEREE’D. <br />
            <br />A FINAL SCORECARD IS UPLOADED ON-CHAIN THAT SAYS HOW THE
            GAME’S TREASURY SHOULD BE SHARED.
            <br />
            <br />
            NFT HOLDERS FROM ALL TEAMS ATTEST TO THE CORRECT SCORECARD TO RATIFY
            IT. <br />
            <br />
            BURN YOUR TEAM’S NFT TO RECLAIM ETH FROM THE GAME AT ANY TIME AFTER
            A SCORECARD HAS BEEN RATIFIED
          </p>
        </div>
      </div>
      <br />
      <span className={styles.disclaimer}>
        {" "}
        *THE OUTCOME IS SUBJECT TO THE RATIFIED SCORECARD DURING PHASE 4.
      </span>
      </Content>
    </>
  );
};

export default Rules;
