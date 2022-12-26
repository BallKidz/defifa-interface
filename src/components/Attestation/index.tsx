/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useScorecards } from "../../hooks/useScorecards";
import { convertScoreCardToPercents } from "../../utils/scorecard";
import { ballkidsScorecard } from "../Scorecard/constants/ballKidsScorecard";
import styles from "./Attestation.module.css";
import AttestationCard from "./AttestationCard";
import { ScoreCard } from "./types";

interface AttestationProps {
  tiers: any[];
}

const Attestation: React.FC<AttestationProps> = (props) => {
  const { scoreCards, isLoading } = useScorecards();
  const [scoreCardAttestations, setScoreCardAttestations] =
    useState<ScoreCard[]>();

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
            : `Custom scorecard ${index + 1}`, // add the index + 1 to the title,
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
        <p className={styles.attestationHeader}>Submit scorecard attestation</p>
        <p>
          50% of NFT holders from all teams attest to the correct scorecard to
          ratify it. Each team has 1 vote, divided between all holders of that
          team's NFTs.
        </p>
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

        <div className={styles.proposals}>
          {!isLoading &&
            scoreCardAttestations?.map((proposal: ScoreCard, i: any) => (
              <AttestationCard
                proposal={proposal}
                key={i}
                tiers={props.tiers}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Attestation;
