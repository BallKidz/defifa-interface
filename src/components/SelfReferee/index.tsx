/* eslint-disable @next/next/no-img-element */
//nextjs Functional component

import moment from "moment";
import { ThreeDots } from "react-loader-spinner";
import { useDeployerDuration } from "../../hooks/read/DeployerDuration";
import { useNextPhaseNeedsQueueing } from "../../hooks/read/PhaseNeedQueueing";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { useQueueNextPhase } from "../../hooks/write/useQueueNextPhase";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./SelfReferee.module.css";

const SelfRefree = () => {
  const { write, isLoading, isSuccess, isError } = useQueueNextPhase();
  const { data } = useProjectCurrentFundingCycle();
  const deployerDuration = useDeployerDuration();
  const { data: queueData, isLoading: nextPhaseNeedsQueueingLoading } =
    useNextPhaseNeedsQueueing();
  let needsQueueing = queueData! as unknown as boolean;
  const beforeEnd = moment(deployerDuration?.end * 1000).subtract(7, "days");

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

        <Button
          onClick={() => {}}
          size="big"
          disabled={beforeEnd.isBefore(deployerDuration?.end * 1000)}
        >
          Change attestation
        </Button>
        <br />
        <br />
        <p>
          Each game phase must also be queued by someone in the public in a
          timely manner.
        </p>
        <Button
          onClick={() => {
            write?.();
          }}
          size="big"
          disabled={false || nextPhaseNeedsQueueingLoading || !needsQueueing}
        >
          {isLoading || nextPhaseNeedsQueueingLoading ? (
            <img
              style={{ marginTop: "5px" }}
              src="/assets/defifa_spinner.gif"
              alt="spinner"
              width={35}
            />
          ) : needsQueueing ? (
            <span> Queue phase {data?.fundingCycle.number.toNumber() + 1}</span>
          ) : (
            <span>
              {" "}
              Phase {data?.fundingCycle.number.toNumber() + 1} Already Queued
            </span>
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
