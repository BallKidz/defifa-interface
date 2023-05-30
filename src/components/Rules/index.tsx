/* eslint-disable react/no-unescaped-entities */
import CurrentPhase from "components/Navbar/Info/CurrentPhase";
import { useGameContext } from "contexts/GameContext";
import { useDeployerDates } from "hooks/read/DeployerDates";
import { useGameMetadata } from "hooks/read/GameMetadata";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import styles from "./index.module.css";

const Rules = () => {
  const { mintDuration, start, refundDuration } = useDeployerDates("local");
  const { data: currentFc } = useProjectCurrentFundingCycle();
  const currentFcNumber = currentFc?.fundingCycle.number.toNumber();
  const { gameId } = useGameContext();
  const { data: gameMetadata } = useGameMetadata(gameId);

  const fillPill = (phase: number) => {
    if (currentFcNumber === phase) {
      return "Active";
    } else if (currentFcNumber > phase) {
      return "Completed";
    } else if (currentFcNumber < phase) {
      switch (phase) {
        case 1:
          return `${mintDuration.date}`;
        case 2:
          return `${refundDuration.date}`;
        case 3:
          return `${start.date}`;
        default:
        // case 4:
        //   return `${end.date}`;
      }
    }
  };

  const pillStyle = (phase: number) => {
    if (currentFcNumber > phase) {
      return styles.completed;
    } else if (currentFcNumber === phase) {
      return styles.active;
    } else {
      return styles.upcoming;
    }
  };

  return (
    <div className={styles.rulesContainer}>
      <h2 className="text-xl mb-2">Rules</h2>
      <p>{gameMetadata?.description}</p>

      <CurrentPhase />

      <div className="flex flex-col gap-4 mt-5">
        <div>
          Phase 1: Minting (mints open, refunds open)
          <span className={pillStyle(mintDuration.phase)}>
            {fillPill(mintDuration.phase)}
          </span>
        </div>
        <div>
          Phase 2: Delay (mints closed)
          <span className={pillStyle(refundDuration.phase)}>
            {fillPill(refundDuration.phase)}
          </span>
        </div>
        <div>
          Phase 3: Game time (refunds closed)
          <span className={pillStyle(start.phase)}>
            {fillPill(start.phase)}
          </span>
        </div>
        <div>Phase 4: Scorecard submission</div>
      </div>
    </div>
  );
};

export default Rules;
