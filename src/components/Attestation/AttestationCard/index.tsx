/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { useBlockNumber } from "wagmi";
import { useProposalDeadline } from "../../../hooks/read/ProposalDeadline";
import { useProposalState } from "../../../hooks/read/ProposalState";
import { useProposalVotes } from "../../../hooks/read/ProposalVotes";
import { useQuorum } from "../../../hooks/read/Quorum";
import { useCastVote } from "../../../hooks/write/useCastVote";
import { formatDateToUTC } from "../../../utils/format/formatDate";
import { convertPercentsToPoints } from "../../../utils/scorecard";
import Group from "../../Group";
import Button from "../../UI/Button";
import CustomModal from "../../UI/Modal";
import { ScoreCard } from "../types";
import styles from "./AttestationCard.module.css";

interface AttestationCardProps {
  proposal: ScoreCard;
  tiers: any[];
}

const AttestationCard: React.FC<AttestationCardProps> = (props) => {
  const [openModal, setIsOpenModal] = useState<boolean>(false);
  const { data: proposalDeadline } = useProposalDeadline(
    props.proposal.scoreCard.proposalId
  );
  const { data: blockNumber } = useBlockNumber();

  const { data: quorum } = useQuorum(props.proposal.scoreCard.proposalId);
  const { data: proposalState } = useProposalState(
    props.proposal.scoreCard.proposalId
  );
  const { data: proposalVotes } = useProposalVotes(
    props.proposal.scoreCard.proposalId
  );
  const [votingOption, setVotingOption] = useState<number>();
  const { write, isLoading, isError } = useCastVote(
    props.proposal.scoreCard.proposalId,
    votingOption
  );
  const [proposalEnd, setProposalEnd] = useState<number>(0);
  const [votingState, setVotingState] = useState<string>("");

  useEffect(() => {
    const state = proposalState?.toString();

    switch (state) {
      case "0":
        setVotingState("Pending");
        break;
      case "1":
        setVotingState("Active");
        break;
      case "2":
        setVotingState("Canceled");
        break;
      case "3":
        setVotingState("Defeated");
        break;
      case "4":
        setVotingState("Queued");
        break;
      case "5":
        setVotingState("Expired");
        break;
      case "6":
        setVotingState("Executed");
        break;

      default:
        break;
    }
  }, [proposalState]);

  function toStringWithSuffix(n: number): string {
    if (n < 1000) {
      return n.toString();
    } else if (n < 1000000) {
      return (n / 1000).toFixed(0) + " thousands";
    } else if (n < 1000000000) {
      return (n / 1000000).toFixed(0) + " millions";
    } else {
      return (n / 1000000000).toFixed(0) + " billions";
    }
  }
  ``;

  useEffect(() => {
    if (!proposalDeadline || !blockNumber) return;

    const blockDuration = 12;
    const currentDate = new Date();
    const proposalEnd = new Date(
      currentDate.getTime() +
        (proposalDeadline.toNumber() - blockNumber) * blockDuration * 1000
    );
    const proposalEndInMillis = proposalEnd.getTime();
    setProposalEnd(proposalEndInMillis);
  }, [proposalDeadline, blockNumber]);

  useEffect(() => {
    if (isLoading || isError) {
      setVotingOption(undefined);
    }
  }, [isLoading, isError]);

  const icon = useMemo<string | undefined>(() => {
    switch (props.proposal.isEqual) {
      case true:
        return "/assets/defifa.svg";
      case false:
        return "/assets/scorecard-small.png";
      default:
        break;
    }
  }, [props.proposal.isEqual]);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const toggleVotingYesOption = () => {
    setVotingOption((prevValue) => {
      if (prevValue === 1) {
        return undefined;
      }
      return 1;
    });
  };

  const toggleVotingNoOption = () => {
    setVotingOption((prevValue) => {
      if (prevValue === 0) {
        return undefined;
      }
      return 0;
    });
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.scoreCardExpand} onClick={handleOpenModal}>
          <Button size="small">View</Button>
        </div>

        <div className={styles.scoreCardInfo}>
          <img
            src={icon}
            alt="Scorecard"
            width={props.proposal.isEqual ? 98 : 81}
          />
          <p className={styles.scoreCardTitle}>{props.proposal.title}</p>
          <p>
            For:{toStringWithSuffix(proposalVotes?.forVotes.toNumber())} votes
          </p>
          <p>
            Against:
            {toStringWithSuffix(proposalVotes?.againstVotes.toNumber())} votes
          </p>
          <p>
            Quorum:
            {toStringWithSuffix(quorum?.toNumber())} votes
          </p>
          <p>Voting state: {votingState}</p>
          <p>Voting ends: {formatDateToUTC(proposalEnd ?? 0, true)} UTC</p>
          <div className={styles.voteForm}>
            <p>Cast your vote</p>
            <div
              className={styles.votingOptions}
              onClick={toggleVotingYesOption}
              style={{
                border:
                  votingOption === 1
                    ? "2px solid var(--gold)"
                    : "2px solid var(--bgColor)",
              }}
            >
              Yes
            </div>
            <div
              className={styles.votingOptions}
              onClick={toggleVotingNoOption}
              style={{
                border:
                  votingOption === 0
                    ? "2px solid var(--gold)"
                    : "2px solid var(--bgColor)",
              }}
            >
              No
            </div>

            <Button
              onClick={() => write?.()}
              disabled={votingOption === undefined}
            >
              {isLoading ? (
                <img
                  style={{ marginTop: "5px" }}
                  src="/assets/defifa_spinner.gif"
                  alt="spinner"
                  width={35}
                />
              ) : (
                "Vote"
              )}
            </Button>
          </div>

          <CustomModal
            openModal={openModal}
            onAfterClose={() => handleCloseModal()}
          >
            <div className={styles.scoreCardContainer}>
              <p className={styles.scoreCardTitle}>{props.proposal.title}</p>

              <div className={styles.scoreCardGroupsContainer}>
                {props.tiers.map((tiers: any, index: any) => (
                  <Group
                    groupName={`${String.fromCharCode(97 + index)}`}
                    key={index}
                  >
                    {tiers.map((t: any) => (
                      <div key={t.id}>
                        <input
                          className={styles.ballKidsScoreCardInput}
                          readOnly
                          value={convertPercentsToPoints(
                            props.proposal.scoreCard.tierWeights.find(
                              (score) => score.id === t.id
                            )?.redemptionWeight,
                            props.proposal.scoreCard.tierWeights
                          )}
                          type="number"
                        />
                        <p>{t.teamName}</p>
                      </div>
                    ))}
                  </Group>
                ))}
              </div>
            </div>
          </CustomModal>
        </div>
      </div>
    </div>
  );
};

export default AttestationCard;
