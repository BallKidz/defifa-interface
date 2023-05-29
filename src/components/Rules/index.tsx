/* eslint-disable react/no-unescaped-entities */
import { useGameContext } from "contexts/GameContext";
import { useDeployerDates } from "hooks/read/DeployerDates";
import { useGameMetadata } from "hooks/read/GameMetadata";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import styles from "./index.module.css";
import CurrentPhase from "components/Navbar/Info/CurrentPhase";

const Rules = () => {
  const { mintDuration, start, refundPeriodDuration } =
    useDeployerDates("local");
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
          return `${refundPeriodDuration.date}`;
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
          Phase 1: Opening ceremony (Mint start)
          <span className={pillStyle(mintDuration.phase)}>
            {fillPill(mintDuration.phase)}
          </span>
        </div>
        <div>
          Phase 2: Refund deadline (Mint ends)
          <span className={pillStyle(refundPeriodDuration.phase)}>
            {fillPill(refundPeriodDuration.phase)}
          </span>
        </div>
        <div>
          Phase 3: Tip-off
          <span className={pillStyle(start.phase)}>
            {fillPill(start.phase)}
          </span>
        </div>
        <div>
          Phase 4: Final whistle{" "}
          {/* <span className={pillStyle(end.phase)}>
                {fillPill(end.phase)}
              </span> */}
        </div>
      </div>
    </div>
  );
};

export default Rules;
