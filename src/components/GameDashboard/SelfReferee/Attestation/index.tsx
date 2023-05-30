/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { useFetchGovernor } from "hooks/read/useFetchGovernor";
import { useScorecards } from "hooks/useScorecards";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { convertScoreCardToPercents } from "utils/scorecard";
import { ballkidsScorecard } from "../Scorecard/constants/ballKidsScorecard";
import Button from "../../../UI/Button";
import styles from "./Attestation.module.css";
import AttestationCard from "./AttestationCard";
import { ScoreCard } from "./types";
import { useScoringOpen } from "components/GameDashboard/MyTeams/MyTeam/useScoringOpen";

interface AttestationProps {
  tiers: any[];
  onScoreCardSubmission?: () => void;
  dataSource: string;
}

const Attestation: React.FC<AttestationProps> = (props) => {
  const { scoreCards, isLoading } = useScorecards();
  const { data: governor } = useFetchGovernor(props.dataSource);
  const [scoreCardAttestations, setScoreCardAttestations] = useState<
    ScoreCard[]
  >([]);
  const scoringOpen = useScoringOpen();

  useEffect(() => {
    if (!scoreCards) return;

    const mappedScoreCards = scoreCards.map(
      (scoreCard: { id: any[]; proposalId: any }) => {
        return {
          proposalId: scoreCard.proposalId,
          tierWeights: scoreCard.id.map((id) => ({
            id: id[0].toNumber(),
            redemptionWeight: id[1].toNumber(),
          })),
        };
      }
    );

    const mappedBallkidsScoreCard =
      convertScoreCardToPercents(ballkidsScorecard);

    const comparisonScoreCards = mappedScoreCards
      .map((scoreCard: any, index: number) => {
        const isBallkidsScoreCard = isEqual(
          scoreCard.tierWeights,
          mappedBallkidsScoreCard
        );
        return {
          isEqual: isBallkidsScoreCard,
          scoreCard,
          title: isBallkidsScoreCard
            ? "Defifa Ballkids scorecard"
            : `Custom scorecard #${index + 1}`,
        };
      })
      .sort((a: { isEqual: boolean }, b: { isEqual: boolean }) => {
        if (a.isEqual) return -1;
        if (b.isEqual) return 1;
        return 0;
      });

    setScoreCardAttestations(comparisonScoreCards);
  }, [scoreCards]);

  return (
    <div className={styles.attestationContainer}>
      <div className={styles.attestationInfoContainer}>
        <p className="mb-3">
          The Defifa Ballkidz (maintainers of Defifa), have submitted a
          scorecard with the points distribution based on those in the Rules.
          Anyone else can submit other scorecards if they wish.
        </p>
        <p className="mb-3">
          Each NFT holder uses their confirmation power to confirm any submitted
          scorecard. After 50% of confirmation power from all teams confirm a
          scorecard, it can be locked in and redemptions can be opened.
        </p>
        <p className="mb-3">
          Each NFT team has equal confirmation power. Each individual NFT has a
          confirmation power equal to that of its team's divided by the total
          supply of NFTs of the team.
        </p>
        {!isLoading && scoreCardAttestations.length === 0 ? (
          <div className={styles.zeroProposals}>
            <p>No scorecards.</p>
            <p>
              <Button
                onClick={props.onScoreCardSubmission}
                disabled={!scoringOpen}
              >
                Submit a scorecard
              </Button>
            </p>
          </div>
        ) : (
          <div className={styles.proposals}>
            {!isLoading &&
              scoreCardAttestations.map((proposal: ScoreCard, i: any) => (
                <AttestationCard
                  governor={governor?.toString() ?? ""}
                  proposal={proposal}
                  key={i}
                  tiers={props.tiers}
                />
              ))}
          </div>
        )}

        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <img src="/assets/defifa_spinner.gif" alt="spinner" width={100} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Attestation;
