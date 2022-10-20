//nextjs Functional component

import React from "react";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./SelfReferee.module.css";

const SelfRefree = () => {
  return (
    <Content title="Self-Refereeing [Work in progress]">
      <div className={styles.selfReferee}>
        <p>
          Defifa relies on the integrity of a few transactions made by the
          game’s participants.
        </p>
        <p>
          Scorecards can be submitted that suggest the correct results of
          off-chain events.
        </p>
        <Button onClick={() => {}} size="big">
          Submit a scorecard
        </Button>
        <br />
        <br />
        <p>
          If you hold an nft, you can send a transaction attesting to a
          submitted scorecard that conveys correct results of off-chain events.
        </p>
        <p className={styles.attestationConfirm}>
          You’ve attested to scorecard with root <b>0xasdf...1234</b> which
          matches <span style={{fontWeight:"bold",textDecoration:"underline"}}>these results</span>.
        </p>
        <Button onClick={() => {}} size="big">
          CHANGE ATTESTATION
        </Button>
        <br />
        <br />
        <p>
          Each game phase must also be queued by someone in the public in a
          timely manner.
        </p>
        <Button onClick={() => {}} size="medium">
          QUEUE PHASE 4
        </Button>
        {/* <br />
        <br />
        <Button onClick={() => {}} size="big" color="#736B6F">
          PHASE 4 ALREADY QUEUED
        </Button> */}
      </div>
    </Content>
  );
};

export default SelfRefree;
