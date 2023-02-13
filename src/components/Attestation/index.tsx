/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useScorecards } from "../../hooks/useScorecards";
import { convertScoreCardToPercents } from "../../utils/scorecard";
import { ballkidsScorecard } from "../Scorecard/constants/ballKidsScorecard";
import Button from "../UI/Button";
import styles from "./Attestation.module.css";
import AttestationCard from "./AttestationCard";
import { ScoreCard } from "./types";

interface AttestationProps {
  tiers: any[];
  onScoreCardSubmission?: () => void;
}

const Attestation: React.FC<AttestationProps> = (props) => {
  const { scoreCards, isLoading } = useScorecards();
  const [loadingState, setLoadingState] = useState(true);
  const [scoreCardAttestations, setScoreCardAttestations] = useState<
    ScoreCard[]
  >([]);

  useEffect(() => {
    setLoadingState(isLoading);
  }, [isLoading]);

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
        <p>
          In scorecard attestation 50% of NFT holders from all teams attest to
          the correct scorecard to ratify it. Each team has 1 vote, divided
          between all holders of that team's NFTs.
        </p>
        <p>
          Since we want to incentivize fair play, we are offering the Defifa
          Ballkids scorecard as the initial option. <br></br>However, as a
          player, you are free to view and vote on any other scorecard that is
          currently available.
        </p>
        {!loadingState && scoreCardAttestations.length === 0 ? (
          <div className={styles.zeroProposals}>
            <p>It appears that the scorecard has not been submitted yet!</p>
            <Button size="medium" onClick={props.onScoreCardSubmission}>
              Submit scorecard
            </Button>
          </div>
        ) : (
          <div className={styles.proposals}>
            {!loadingState &&
              scoreCardAttestations.map((proposal: ScoreCard, i: any) => (
                <AttestationCard
                  proposal={proposal}
                  key={i}
                  tiers={props.tiers}
                />
              ))}
          </div>
        )}

        {loadingState && (
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
