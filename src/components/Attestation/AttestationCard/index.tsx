/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { useBlockNumber } from "wagmi";
import { useProposalDeadline } from "../../../hooks/read/ProposalDeadline";
import { useProposalState } from "../../../hooks/read/ProposalState";
import { useProposalVotes } from "../../../hooks/read/ProposalVotes";
import { useQuorum, useQuorumReached } from "../../../hooks/read/Quorum";
import { useHasVoted } from "../../../hooks/read/useHasVoted";
import { useApproveScorecard } from "../../../hooks/write/useApproveScorecard";
import { useCastVote } from "../../../hooks/write/useCastVote";
import { formatDateToUTC } from "../../../utils/format/formatDate";
import { convertPercentsToPoints } from "../../../utils/scorecard";
import { buildColumns } from "../../../utils/table/columns";
import Button from "../../UI/Button";
import Table from "../../UI/Table";
import { ScoreCard } from "../types";
import styles from "./AttestationCard.module.css";

interface AttestationCardProps {
  proposal: ScoreCard;
  tiers: any[];
}

interface ScorecardData {
  Teams: string;
  Points: number;
}

const AttestationCard: React.FC<AttestationCardProps> = ({
  proposal,
  tiers,
}) => {
  const { data: proposalDeadline } = useProposalDeadline(
    proposal.scoreCard.proposalId
  );
  const { data: blockNumber } = useBlockNumber();

  const { data: quorum } = useQuorum(proposal.scoreCard.proposalId);
  const { data: quorumReached } = useQuorumReached(
    proposal.scoreCard.proposalId
  );
  const { data: proposalState } = useProposalState(
    proposal.scoreCard.proposalId
  );
  const { data: proposalVotes } = useProposalVotes(
    proposal.scoreCard.proposalId
  );
  const { write, isLoading, isError } = useCastVote(
    proposal.scoreCard.proposalId
  );
  const { data: hasVoted } = useHasVoted(proposal.scoreCard.proposalId);
  const { write: approveScorecard, isLoading: isApproveScorecardLoading } =
    useApproveScorecard(proposal.scoreCard.tierWeights);
  const [proposalEnd, setProposalEnd] = useState<number>(0);
  const [votingState, setVotingState] = useState<string>("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [scoreCardData, setScoreCardData] = useState<ScorecardData[]>([]);

  useEffect(() => {
    // Keeping it like this for now until we find better way to include redemptionWeight in tiers
    const scoreCardData: ScorecardData[] = tiers
      .map((obj) => {
        const tierWeight = proposal.scoreCard.tierWeights.find(
          (tw) => tw.id === obj.id
        );
        if (tierWeight) {
          return {
            Teams: obj.teamName,
            Points: convertPercentsToPoints(tierWeight.redemptionWeight),
          };
        }
        return { Teams: obj.teamName, Points: 0 }; // add this line to handle cases where there is no matching tierWeight object
      })
      .filter((obj) => obj.Points !== 0) // exclude objects with Points equal to 0
      .sort((a, b) => b.Points - a.Points);
    setScoreCardData(scoreCardData);
  }, [tiers, proposal]);

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

  const toStringWithSuffix = (n: number): string => {
    if (n < 1000) {
      return n.toString();
    } else if (n < 1000000) {
      return (n / 1000).toFixed(0) + "k";
    } else if (n < 1000000000) {
      return (n / 1000000).toFixed(0) + "m";
    } else {
      return (n / 1000000000).toFixed(0) + "bn";
    }
  };

  const icon = useMemo<string | undefined>(() => {
    switch (proposal.isEqual) {
      case true:
        return "/assets/defifa.svg";
      case false:
        return "/assets/scorecard-small.png";
      default:
        break;
    }
  }, [proposal.isEqual]);

  const handleClick = () => {
    setIsFlipped((prevState) => !prevState);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <div className={styles.container} key="front">
        <div className={styles.scoreCardExpand}>
          <Button size="medium" onClick={handleClick}>
            View proposal
          </Button>
        </div>

        <div className={styles.scoreCardInfo}>
          <img src={icon} alt="Scorecard" width={proposal.isEqual ? 98 : 81} />
          <p className={styles.scoreCardTitle}>{proposal.title}</p>
          <p>
            For:{toStringWithSuffix(proposalVotes?.forVotes.toNumber())} votes
          </p>

          <p>
            Quorum:
            {toStringWithSuffix(quorum?.toNumber())} votes
          </p>
          <p>Voting state: {votingState}</p>
          <p>Voting ends: {formatDateToUTC(proposalEnd ?? 0, true)} UTC</p>
          <div className={styles.voteForm}>
            <Button onClick={() => write?.()} disabled={isLoading}>
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
            <Button
              onClick={() => approveScorecard?.()}
              disabled={!quorumReached}
            >
              {isApproveScorecardLoading ? (
                <img
                  style={{ marginTop: "5px" }}
                  src="/assets/defifa_spinner.gif"
                  alt="spinner"
                  width={35}
                />
              ) : (
                "Approve"
              )}
            </Button>
          </div>
        </div>
      </div>
      <div key="back" className={styles.container}>
        <div className={styles.scoreCardExpand}>
          <Button size="medium" onClick={handleClick}>
            View scorecard
          </Button>
        </div>
        <div className={styles.scoreCardInfo}>
          <img src={icon} alt="Scorecard" width={proposal.isEqual ? 98 : 81} />
          <p className={styles.scoreCardTitle}>{proposal.title}</p>
          {scoreCardData.length > 0 && (
            <Table data={scoreCardData} columns={buildColumns(scoreCardData)} />
          )}
        </div>
      </div>
    </ReactCardFlip>
  );
};

export default AttestationCard;
