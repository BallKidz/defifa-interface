/* eslint-disable @next/next/no-img-element */
//nextjs Functional component

import { chunk } from "lodash";
import moment from "moment";
import { useMemo, useState } from "react";
import useNftRewards from "../../hooks/NftRewards";
import { useDeployerDuration } from "../../hooks/read/DeployerDuration";
import { useNftRewardTiersOf } from "../../hooks/read/NftRewardsTiers";
import { useNextPhaseNeedsQueueing } from "../../hooks/read/PhaseNeedQueueing";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { useMintReservesFor } from "../../hooks/write/useMintReservesFor";
import { useQueueNextPhase } from "../../hooks/write/useQueueNextPhase";
import Attestation from "../Attestation";
import ScoreCard from "../Scorecard";
import Button from "../UI/Button";
import Content from "../UI/Content";
import CustomModal from "../UI/Modal";
import styles from "./SelfReferee.module.css";

type modalOption = "scorecard" | "attestation";

const SelfRefree = () => {
  const { write, isLoading, isSuccess, isError } = useQueueNextPhase();
  const { data } = useProjectCurrentFundingCycle();
  const fundingCycle = data?.fundingCycle.number.toNumber();
  const { data: tiers } = useNftRewardTiersOf(data?.metadata.dataSource);
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tiers ?? []
  );
  const chunkedRewardTiers = chunk(rewardTiers, 4);

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
  const [openModal, setIsOpenModal] = useState<boolean>(false);
  const [modalOption, setModalOption] = useState<modalOption>();

  const onSubmitScoreCardClick = () => {
    setModalOption("scorecard");
    handleOpenModal();
  };

  const onSubmitAttestationClick = () => {
    setModalOption("attestation");
    handleOpenModal();
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const modalContent = useMemo<JSX.Element | undefined>(() => {
    switch (modalOption) {
      case "scorecard":
        return <ScoreCard tiers={chunkedRewardTiers} />;
      case "attestation":
        return <Attestation tiers={chunkedRewardTiers} />;
      default:
        break;
    }
  }, [chunkedRewardTiers, modalOption]);

  return (
    <Content title="Self-Refereeing" open={true}>
      <div className={styles.selfReferee}>
        <CustomModal
          openModal={openModal}
          onAfterClose={() => handleCloseModal()}
        >
          {modalContent}
        </CustomModal>
        <p>
          Defifa relies on the integrity of a few transactions made by the
          game’s participants.
        </p>
        <p>
          Scorecards can be submitted that suggest the correct results of
          off-chain events.
        </p>
        <Button onClick={onSubmitScoreCardClick} size="big" disabled={true}>
          Submit a scorecard
        </Button>
        <br />
        <br />
        <p>
          If you hold an nft, you can send a transaction attesting to a
          submitted scorecard that conveys correct results of off-chain events.
        </p>

        <Button
          onClick={onSubmitAttestationClick}
          disabled={fundingCycle !== 4}
          size="big"
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
            mintReservesLoading ||
            mintReservesSuccess ||
            mintReservesDisabled ||
            fundingCycle == 1 ||
            fundingCycle === 2
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
            <span> Queue phase {fundingCycle + 1}</span>
          ) : (
            <span> Phase {fundingCycle + 1} Already Queued</span>
          )}
        </Button>
      </div>
    </Content>
  );
};

export default SelfRefree;
