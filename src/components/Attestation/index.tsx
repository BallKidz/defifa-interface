/* eslint-disable react/no-unescaped-entities */
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useScorecards } from "../../hooks/useScorecards";
import { convertScoreCardToPercents } from "../../utils/scorecard";
import { ballkidsScorecard } from "../Scorecard/constants/ballKidsScorecard";
import styles from "./Attestation.module.css";

interface ScoreCard {
  isEqual: boolean;
  mappedScoreCard: {
    id: number;
    redemptionWeight: number;
  };
}

const Attestation = () => {
  const { scoreCards } = useScorecards();
  const [scoreCardAttestations, setScoreCardAttestations] =
    useState<ScoreCard[]>();

  useEffect(() => {
    if (!scoreCards) return;

    const mappedScoreCards = scoreCards.map((scoreCard: { id: any[] }) => {
      return scoreCard.id.map((id) => ({
        id: id[0].toNumber(),
        redemptionWeight: id[1].toNumber(),
      }));
    });

    const mappedBallkidsScoreCard =
      convertScoreCardToPercents(ballkidsScorecard);

    const comparisonScoreCards = mappedScoreCards.map(
      (mappedScoreCard: any) => {
        return {
          mappedScoreCard,
          isEqual: isEqual(mappedScoreCard, mappedBallkidsScoreCard),
        };
      }
    );

    setScoreCardAttestations(comparisonScoreCards);
  }, [scoreCards]);

  console.log(scoreCardAttestations);

  return (
    <div className={styles.attestationContainer}>
      <div className={styles.attestationInfoContainer}>
        <p className={styles.attestationHeader}>Submit scorecard attestation</p>
        <p>
          50% of NFT holders from all teams attest to the correct scorecard to
          ratify it. Each team has 1 vote, divided between all holders of that
          team's NFTs.
        </p>
        <div className={styles.proposals}>
          {scoreCardAttestations?.map((scoreCard: any) => {
            // eslint-disable-next-line react/jsx-key
            return <div>{scoreCard.isEqual}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default Attestation;
