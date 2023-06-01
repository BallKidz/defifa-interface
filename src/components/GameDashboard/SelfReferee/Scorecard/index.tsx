import Button from "components/UI/Button";
import { Input } from "components/UI/Input";
import Table from "components/UI/Table";
import useScorecardTable from "hooks/useScorecardData";
import { useSubmitScorecard } from "hooks/write/useSubmitScorecard";
import { FC, useEffect, useState } from "react";
import { convertScoreCardToPercents } from "utils/scorecard";
import styles from "./Scorecard.module.css";
import { ballkidsScorecard } from "./constants/ballKidsScorecard";
import { useScoringOpen } from "components/GameDashboard/MyTeams/MyTeam/useScoringOpen";

interface ScoreCard {
  id: number;
  redemptionWeight: number;
}

interface ScoreCardProps {
  tiers: any[];
  governor: string;
}

const ScoreCard: FC<ScoreCardProps> = (props) => {
  const { data, columns } = useScorecardTable();

  const [scoreCardOption, setScoreCardOption] = useState<number>(1);
  const [scoreCard, setScoreCard] = useState<ScoreCard[]>(ballkidsScorecard);
  const [scoreCardWithPercents, setScoreCardWithPercents] = useState<
    ScoreCard[]
  >([]);
  const { write, isLoading, isSuccess, isError } = useSubmitScorecard(
    scoreCardWithPercents
  );

  const scoringOpen = useScoringOpen();

  useEffect(() => {
    switch (scoreCardOption) {
      case 1:
        const ballkidScoreCard = convertScoreCardToPercents(ballkidsScorecard);
        setScoreCardWithPercents(ballkidScoreCard);
        break;
      case 2:
        const customScoreCard = convertScoreCardToPercents(scoreCard);
        setScoreCardWithPercents(customScoreCard);
        break;
      default:
        break;
    }
  }, [scoreCardOption, scoreCard]);

  useEffect(() => {
    if (isSuccess || isError) {
      setScoreCard([]);
    }
  }, [isError, isSuccess]);

  const submitScoreCard = () => {
    write?.();
  };

  const onTierScoreChange = (redemptionWeight: number, id: number) => {
    // Check if an object with the same id already exists in the scoreCard array
    const existingScore = scoreCard.find((score) => score.id === id);

    // If an object with the same id already exists, update its redemptionWeight
    if (existingScore) {
      setScoreCard(
        scoreCard.map((score) => {
          if (score.id === id) {
            return {
              id,
              redemptionWeight,
            };
          }
          return score;
        })
      );
    } else {
      // If an object with the same id does not exist, add a new object to the scoreCard array
      setScoreCard([
        ...scoreCard,
        {
          id,
          redemptionWeight,
        },
      ]);
    }
  };

  return (
    <div className={styles.scoreCardContainer}>
      <div className={styles.scoreCardInfo}>
        <p>Defifa provides players with 2 options to submit a scorecard:</p>
        <p className={styles.scoreCardOptionsLabel}>
          1. Defifa Ballkidz scorecard - prefilled scorecard which is ratified
          by developers of this website and game.
        </p>
        <p className={styles.scoreCardOptionsLabel}>
          2. Fill your own scorecard - create your own scorecard, you have the
          freedom to fill it out as you see fit.
        </p>
      </div>
      <div className={styles.scoreCardOptions}>
        <Button
          variant="secondary"
          onClick={() => setScoreCardOption(1)}
          style={{
            borderBottom:
              scoreCardOption === 1 ? "1px solid var(--gold)" : "none",
          }}
        >
          Option 1: Defifa Ballkidz scorecard
        </Button>
        <Button
          variant="secondary"
          onClick={() => setScoreCardOption(2)}
          style={{
            borderBottom:
              scoreCardOption === 2 ? "1px solid var(--gold)" : "none",
          }}
        >
          Option 2: Fill your own scorecard
        </Button>
      </div>

      <div className={styles.scoreCardOptionsContainer}>
        <div className={styles.scoreCardGroupsContainer}>
          {scoreCardOption === 1 ? (
            <Table data={data} columns={columns} />
          ) : (
            <div className={styles.tiersContainer}>
              {props.tiers?.map((t: any) => (
                <div key={t.id}>
                  <Input
                    value={
                      scoreCard.find((score) => score.id === t.id)
                        ? scoreCard.find((score) => score.id === t.id)
                            ?.redemptionWeight
                        : 0
                    }
                    onChange={(e) =>
                      onTierScoreChange(parseFloat(e.currentTarget.value), t.id)
                    }
                    min={0}
                    step={1}
                    type="number"
                  />
                  <p>{t.teamName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.scoreCardButtonContainer}>
        <Button onClick={submitScoreCard} disabled={isLoading || !scoringOpen}>
          {isLoading ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              style={{ marginTop: "5px" }}
              src="/assets/defifa_spinner.gif"
              alt="spinner"
              width={35}
            />
          ) : (
            "Submit scorecard"
          )}
        </Button>
        {scoreCardOption === 2 && (
          <Button variant="secondary" onClick={() => setScoreCard([])}>
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
