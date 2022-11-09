/* eslint-disable @next/next/no-img-element */
//nextjs Functional component

import { ThreeDots } from "react-loader-spinner";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { useQueueNextPhase } from "../../hooks/write/useQueueNextPhase";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./SelfReferee.module.css";

const SelfRefree = () => {
  const { write, isLoading, isSuccess, isError } = useQueueNextPhase();
  const { data } = useProjectCurrentFundingCycle();
  return (
    <Content title="Self-Refereeing [Work in progress]" open={true}>
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
          matches{" "}
          <a
            href=""
            style={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            these results
          </a>
          .
        </p>
        <Button onClick={() => {}} size="big">
          Change attestation
        </Button>
        <br />
        <br />
        <p>
          Each game phase must also be queued by someone in the public in a
          timely manner.
        </p>
        <Button onClick={write} size="big">
          {isLoading ? (
            <img
              style={{ marginTop: "5px" }}
              src="/assets/defifa_spinner.gif"
              alt="spinner"
              width={35}
            />
          ) : (
            <span>Queue phase {data?.fundingCycle.number.toNumber() + 1}</span>
          )}
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
