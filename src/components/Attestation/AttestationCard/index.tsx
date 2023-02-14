/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { useBlockNumber } from "wagmi";
import { useCountdown } from "../../../hooks/Countdown";
import { usePaymentTerminalBalance } from "../../../hooks/read/PaymentTerminalBalance";
import { useProposalDeadline } from "../../../hooks/read/ProposalDeadline";
import { useProposalVotes } from "../../../hooks/read/ProposalVotes";
import { useQuorum } from "../../../hooks/read/Quorum";
import { useApproveScorecard } from "../../../hooks/write/useApproveScorecard";
import { useCastVote } from "../../../hooks/write/useCastVote";
import { fromWad } from "../../../utils/format/formatNumber";
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
  "Treasury Share": string;
  Redemption: string;
}

const AttestationCard: React.FC<AttestationCardProps> = ({
  proposal,
  tiers,
}) => {
  const { data: treasuryAmount } = usePaymentTerminalBalance();

  const { data: proposalDeadline } = useProposalDeadline(
    proposal.scoreCard.proposalId
  );
  const { data: blockNumber } = useBlockNumber();

  const { data: quorum } = useQuorum(proposal.scoreCard.proposalId);

  const { data: proposalVotes } = useProposalVotes(
    proposal.scoreCard.proposalId
  );
  const { write, isLoading, isError } = useCastVote(
    proposal.scoreCard.proposalId
  );
  const { write: approveScorecard, isLoading: isApproveScorecardLoading } =
    useApproveScorecard(proposal.scoreCard.tierWeights);
  const [proposalEnd, setProposalEnd] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scoreCardData, setScoreCardData] = useState<ScorecardData[]>([]);
  const { timeRemaining } = useCountdown(new Date(proposalEnd));

  useEffect(() => {
    if (!tiers || !proposal || !treasuryAmount) return;

    const totalPot = parseFloat(fromWad(treasuryAmount));

    const scoreCardData: ScorecardData[] = proposal.scoreCard.tierWeights
      .filter((tw) => tiers.some((t) => t.id === tw.id))
      .map((tw) => {
        const team = tiers.find((t) => t.id === tw.id);
        return {
          Teams: team ? team.teamName : "",
          Points: convertPercentsToPoints(tw.redemptionWeight),
          "Treasury Share": "",
          Redemption: "0",
        };
      });

    const totalRedemption = scoreCardData.reduce(
      (sum, obj) => sum + obj.Points,
      0
    );
    scoreCardData.forEach((obj) => {
      if (obj.Points !== 0) {
        obj["Treasury Share"] =
          ((obj.Points / totalRedemption) * 100).toFixed(2) + "%";
        obj.Redemption = (totalPot * (obj.Points / totalRedemption)).toFixed(4);
        obj.Redemption = `Ξ${obj.Redemption}`;
      }
    });

    setScoreCardData(
      scoreCardData
        .filter((obj) => obj.Points !== 0)
        .sort((a, b) => b.Points - a.Points)
    );
  }, [tiers, proposal, treasuryAmount]);

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
            <div className={styles.buttonContent}>
              <img src="/icons/flip-icon.png" alt="Flip" width={27} />
              View proposal
            </div>
          </Button>
        </div>

        <div className={styles.scoreCardInfo}>
          <img src={icon} alt="Scorecard" width={proposal.isEqual ? 98 : 81} />
          <p className={styles.scoreCardTitle}>{proposal.title}</p>
          <p>
            Status:{toStringWithSuffix(proposalVotes?.forVotes.toNumber())}{" "}
            confirmations
          </p>

          <p>
            Quorum:
            {toStringWithSuffix(quorum?.toNumber())} confirmations
          </p>
          <p>Confirmation deadline: In {timeRemaining}</p>
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
                "Confirm"
              )}
            </Button>
            <Button
              onClick={() => approveScorecard?.()}
              disabled={quorum?.gt(proposalVotes?.forVotes)}
            >
              {isApproveScorecardLoading ? (
                <img
                  style={{ marginTop: "5px" }}
                  src="/assets/defifa_spinner.gif"
                  alt="spinner"
                  width={35}
                />
              ) : (
                "Lock in"
              )}
            </Button>
          </div>
        </div>
      </div>
      <div key="back" className={styles.container}>
        <div className={styles.scoreCardExpand}>
          <Button size="medium" onClick={handleClick}>
            <div className={styles.buttonContent}>
              <img src="/icons/flip-icon.png" alt="Flip" width={27} />
              View scorecard
            </div>
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
