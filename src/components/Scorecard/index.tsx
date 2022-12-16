import { FixedNumber } from "ethers";
import { FC, useEffect, useState } from "react";
import { useSubmitScorecards } from "../../hooks/write/useSubmitScorecards";
import Group from "../Group";
import Button from "../UI/Button";
import styles from "./Scorecard.module.css";

interface ScoreCard {
  id: number;
  redemptionWeight: number;
}

interface ScoreCardProps {
  tiers: any[];
}

const ballkidsScoreCard = [
  ...Array.from({ length: 32 }).map((_, i) => ({
    id: i + 1,
    redemptionWeight: 100 + Math.floor(Math.random() * 100) + 1,
  })),
];

const ScoreCard: FC<ScoreCardProps> = (props) => {
  const [scoreCardOption, setScoreCardOption] = useState<number>(1);
  const [scoreCard, setScoreCard] = useState<ScoreCard[]>([]);
  const [scoreCardWithPercents, setScoreCardWithPercents] = useState<
    ScoreCard[]
  >([]);
  const { write, isLoading, isSuccess, isError } = useSubmitScorecards(
    scoreCardWithPercents
  );

  useEffect(() => {
    switch (scoreCardOption) {
      case 1:
        const ballkidScoreCard = convertScoreCardToPercents(ballkidsScoreCard);
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

  const convertScoreCardToPercents = (scoreCard: ScoreCard[]) => {
    const totalSum = scoreCard.reduce(
      (total, obj) => total + obj.redemptionWeight,
      0
    );

    const scoreCardWithPercents = scoreCard.map((obj) => {
      const newObj = { ...obj };
      newObj.redemptionWeight = Math.floor(
        (newObj.redemptionWeight / totalSum) * 1000000000
      );

      return newObj;
    });

    return scoreCardWithPercents;
  };

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
        <p className={styles.scoreCardHeader}>Submit a scorecard</p>
        <p>Defifa provides players with 2 options to submit a scorecard:</p>
        <p className={styles.scoreCardOptionsLabel}>
          1. Defifa Ballkids scorecard - prefilled scorecard which is ratified
          by developers of this website and game.
        </p>
        <p className={styles.scoreCardOptionsLabel}>
          2. Fill your own scorecard - lorem ipsum
        </p>
        <p>
          You as the player are free to fill up your own scorecard and choose
          how you want to use points, even though we as Defifa Ballkids have
          chosen option 1 as the default since we want to inspire fair play.
          This is just a game, after all.
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
          {props.tiers.map((tiers: any, index: any) => (
            <Group groupName={`${String.fromCharCode(97 + index)}`} key={index}>
              {scoreCardOption === 1
                ? tiers.map((t: any) => (
                    <div key={t.id}>
                      <input
                        readOnly
                        value={
                          ballkidsScoreCard.find((score) => score.id === t.id)
                            ?.redemptionWeight
                        }
                        type="number"
                      />
                      <p>{t.teamName}</p>
                    </div>
                  ))
                : tiers.map((t: any) => (
                    <div key={t.id}>
                      <input
                        value={
                          scoreCard.find((score) => score.id === t.id)
                            ? scoreCard.find((score) => score.id === t.id)
                                ?.redemptionWeight
                            : 0
                        }
                        onChange={(e) =>
                          onTierScoreChange(
                            parseFloat(e.currentTarget.value),
                            t.id
                          )
                        }
                        min={0}
                        step={1}
                        type="number"
                      />
                      <p>{t.teamName}</p>
                    </div>
                  ))}
            </Group>
          ))}
        </div>
      </div>
      <div className={styles.scoreCardButtonContainer}>
        <Button size="medium" onClick={submitScoreCard} disabled={isLoading}>
          {isLoading ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              style={{ marginTop: "5px" }}
              src="/assets/defifa_spinner.gif"
              alt="spinner"
              width={35}
            />
          ) : (
            "Submit"
          )}
        </Button>
        {scoreCardOption === 2 && (
          <Button size="medium" onClick={() => setScoreCard([])}>
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
