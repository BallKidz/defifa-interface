import useScorecardTable from "../../../hooks/useScorecardData";
import { useSubmitScorecards } from "../../../hooks/write/useSubmitScorecards";
import { convertScoreCardToPercents } from "../../../utils/scorecard";
import Button from "../../UI/Button";
import Table from "../../UI/Table";
import { ballkidsScorecard } from "../constants/ballKidsScorecard";
import styles from "./BallkidsScorecard.module.css";

const BallkidsScorecard = (governor: string) => {
  const { data, columns } = useScorecardTable();
  const { write, isLoading, isSuccess, isError, error } = useSubmitScorecards(
    ballkidsScorecard,
    governor
  );

  return (
    <div className={styles.container}>
      <h3>Defifa Ballkids Scorecard</h3>
      <Table columns={columns} data={data} />
      <div className={styles.buttonContainer}>
        <Button size="medium" onClick={() => write?.()} disabled={isLoading}>
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
      </div>
    </div>
  );
};

export default BallkidsScorecard;
