/* eslint-disable @next/next/no-img-element */
//nextjs Functional component

import { chunk } from "lodash";
import moment from "moment";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import useNftRewards from "../../hooks/NftRewards";
import { useDeployerDuration } from "../../hooks/read/DeployerDuration";
import { useNftRewardTiersOf } from "../../hooks/read/NftRewardsTiers";
import { useNextPhaseNeedsQueueing } from "../../hooks/read/PhaseNeedQueueing";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { useMintReservesFor } from "../../hooks/write/useMintReservesFor";
import { useQueueNextPhase } from "../../hooks/write/useQueueNextPhase";
import Group from "../Group";
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
  const [scoreCardOption, setScoreCardOption] = useState<number>(1);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <Content title="Self-Refereeing [Work in progress]" open={true}>
      <div className={styles.selfReferee}>
        <CustomModal
          openModal={openModal}
          onAfterClose={() => handleCloseModal()}
        >
          <div className={styles.scoreCardContainer}>
            <div className={styles.scoreCardInfo}>
              <p className={styles.scoreCardHeader}>Submit a scorecard</p>
              <p>
                Defifa provides players with 2 options to submit a scorecard:
              </p>
              <p className={styles.scoreCardOptionsLabel}>
                1. Defifa Ballkids scorecard - prefilled scorecard which is
                ratified by developers of this website and game.
              </p>
              <p className={styles.scoreCardOptionsLabel}>
                2. Fill your own scorecard - lorem ipsum
              </p>
              <p>
                You as the player are free to fill up your own scorecard and
                choose how you want to use points, even though we as Defifa
                Ballkids have chosen option 1 as the default since we want to
                inspire fair play. This is just a game, after all.
              </p>
            </div>
            <div className={styles.scoreCardOptions}>
              <p
                onClick={() => setScoreCardOption(1)}
                style={{
                  borderBottom:
                    scoreCardOption === 1 ? "1px solid var(--gold)" : "none",
                  color: scoreCardOption === 1 ? "var(--gold)" : "inherit",
                }}
              >
                Option 1: Defifa Ballkids scorecard
              </p>
              <p
                onClick={() => setScoreCardOption(2)}
                style={{
                  borderBottom:
                    scoreCardOption === 2 ? "1px solid var(--gold)" : "none",
                  color: scoreCardOption === 2 ? "var(--gold)" : "inherit",
                }}
              >
                Option 2: Fill your own scorecard
              </p>
            </div>
            <div className={styles.scoreCardOptionsContainer}>
              <div className={styles.scoreCardGroupsContainer}>
                {chunkedRewardTiers.map((tiers: any, index: any) => (
                  <Group
                    groupName={`${String.fromCharCode(97 + index)}`}
                    key={index}
                  >
                    {tiers.map((t: any) => (
                      <div key={t.id}>
                        <input type="number" />
                        <p>{t.teamName}</p>
                      </div>
                    ))}
                  </Group>
                ))}
              </div>
            </div>
            <div className={styles.scoreCardButtonContainer}>
              <Button size="medium">Submit</Button>
            </div>
          </div>
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
          Change attestation
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
