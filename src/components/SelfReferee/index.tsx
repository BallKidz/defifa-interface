/* eslint-disable @next/next/no-img-element */
//nextjs Functional component

import { chunk } from "lodash";
import moment from "moment";
import { useState } from "react";
import useNftRewards from "../../hooks/NftRewards";
import { useDeployerDuration } from "../../hooks/read/DeployerDuration";
import { useNftRewardTiersOf } from "../../hooks/read/NftRewardsTiers";
import { useNextPhaseNeedsQueueing } from "../../hooks/read/PhaseNeedQueueing";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { useMintReservesFor } from "../../hooks/write/useMintReservesFor";
import { useQueueNextPhase } from "../../hooks/write/useQueueNextPhase";
import ScoreCard from "../Scorecard";
import Button from "../UI/Button";
import Content from "../UI/Content";
import CustomModal from "../UI/Modal";
import styles from "./SelfReferee.module.css";

const SelfRefree = () => {
  const { write, isLoading, isSuccess, isError } = useQueueNextPhase();
  const { data } = useProjectCurrentFundingCycle();
  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiers ?? []
  );
  const chunkedRewardTiers = chunk(rewardTiers, 4);

  const deployerDuration = useDeployerDuration();
  const { data: queueData, isLoading: nextPhaseNeedsQueueingLoading } =
    useNextPhaseNeedsQueueing();
  const {
    write: mintReserves,
    isLoading: mintReservesLoading,
    isSuccess: mintReservesSuccess,
    isError: mintReservesError,
    disabled: mintReservesDisabled,
  } = useMintReservesFor();
  let needsQueueing = queueData! as unknown as boolean;
  const beforeEnd = moment(deployerDuration?.end * 1000).subtract(7, "days");
  const [openModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <Content title="Self-Refereeing" open={true}>
      <div className={styles.selfReferee}>
        <CustomModal
          openModal={openModal}
          onAfterClose={() => handleCloseModal()}
        >
          <ScoreCard tiers={chunkedRewardTiers} />
        </CustomModal>
        <p>
          Defifa relies on the integrity of a few transactions made by the
          game’s participants.
        </p>
        <p>
          Scorecards can be submitted that suggest the correct results of
          off-chain events.
        </p>
        <Button onClick={() => handleOpenModal()} size="big">
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
          Submit attestation
        </Button>

        <p>Mint reserved tokens for all tiers.</p>

        <Button
          onClick={() => {
            mintReserves?.();
          }}
          size="big"
          disabled={
            mintReservesLoading || mintReservesSuccess || mintReservesDisabled
          }
        >
          Mint Reserves
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
