/* eslint-disable react/no-unescaped-entities */
import { useDeployerDates } from "../../hooks/read/DeployerDates";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { formatDateToUTC } from "../../utils/format/formatDate";
import Content from "../UI/Content";
import styles from "./index.module.css";

const Rules = () => {
  const { mintDuration, start, refundPeriodDuration, end } =
    useDeployerDates("local");
  const { data: currentFc } = useProjectCurrentFundingCycle();
  const currentFcNumber = currentFc?.fundingCycle.number.toNumber();

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
        case 4:
          return `${end.date}`;
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
    <Content
      title="See full rules"
      open={false}
      fontSize={"16"}
      color="var(--violet)"
    >
      <div className={styles.rulesContainer}>
        <div className={styles.phases}>
          <div className={styles.phaseBox}>
            <h1>
              Phase 1: Opening ceremony (Mint start)
              <span className={pillStyle(mintDuration.phase)}>
                {fillPill(mintDuration.phase)}
              </span>
            </h1>
            <ul>
              <li>
                There are 8 NFTs competing in this tournament.
              </li>
              <li>Mint an NFT to join a team and increase the game’s pot.</li>
              <li>The NFTs are a claim on this pot.</li>
              <li>You can get a full refund anytime before the tournament starts.</li>
            </ul>
          </div>
          <div className={styles.phaseBox}>
            <h1>
              Phase 2: Refund deadline (Mint ends)
              <span className={pillStyle(refundPeriodDuration.phase)}>
                {fillPill(refundPeriodDuration.phase)}
              </span>
            </h1>
            <ul>
              <li>
                NFTs are no longer being minted, but refunds are still
                permitted.
              </li>
              <li>
                The refund deadline coincides with the start of the first
                tip-off.
              </li>
            </ul>
          </div>
          <div className={styles.phaseBox}>
            <h1>
              Phase 3: Tip-off
              <span className={pillStyle(start.phase)}>
                {fillPill(start.phase)}
              </span>
            </h1>
            <ul>
              <li>
                The pot is locked and refunds permanently end before the first
                kickoff on {formatDateToUTC(1673731800 * 1000, true)} UTC.
                <a href="#pointsSystem">
                  <sup className={styles.superScript}>3</sup>
                </a>
              </li>
              <li>
                Holders of each NFT may benefit from the outcome of each
                basketball game their team plays.
                <a href="#pointsSystem">
                  <sup className={styles.superScript}>1</sup>
                </a>
              </li>
              <li>
                The eventual value of these NFTs recalibrates depending on a
                self-refereed scorecard.
                <a href="#pointsSystem">
                  <sup className={styles.superScript}>2</sup>
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.phaseBox}>
            <h1>
              Phase 4: Final whistle{" "}
              <span className={pillStyle(end.phase)}>
                {fillPill(end.phase)}
              </span>
            </h1>
            <ul>
              <li>The tournament is self refereed.</li>
              <li>
                A final scorecard is uploaded on-chain that says how the tournament's
                pot should be shared.
              </li>
              <li>
                When you mint an NFT you are on a team with the other minters of that NFT. 
                50% of NFT holders from all teams attest to the correct
                scorecard to ratify it. Each team has 1 vote, divided between
                all holders of that team's NFTs.
              </li>
              <li>
                Burn your team’s NFT to reclaim ETH from the game at any time
                after a scorecard has been ratified. Or, keep and trade them
                forever – their value will remain backed by the pot.
              </li>
            </ul>
          </div>
        </div>
        <br />
        <div className={styles.pointSystemWrapper} id="pointsSystem">
          <h1 className={styles.pointHeader}>
            <sup className={styles.superScript}>1 </sup>Point system:
          </h1>
          <p className={styles.pointSystemDescription}>
            Total points:{" "}
            <span className={styles.pointSystemPoints}>100,000</span>
          </p>
          <div className={styles.pointSystemCalculation}>
            <p>
            <span className={styles.pointSystemPoints}>
            40% of the pot</span> is split between players who pick the correct winning team and the correct number of games.
            </p>
            <p>
            <span className={styles.pointSystemPoints}>
            50% of the pot</span> is split between players who pick the correct winning team, but an incorrect number of games.
            </p>
            <p>
            <span className={styles.pointSystemPoints}>
            10% of the pot</span> is split between players who pick the correct number of games, but an incorrect winning team.
            </p>
          </div>
          <p className={styles.pointSystemDescription}>
            The scorecard that is ratified should represent the amount of
            points by each team divided by the total available
            100,000 points. Keep in mind your NFTeam's winnings is divided
            up by all holders of that NFTeam.
          </p>
        </div>
        <div className={styles.disclaimerContainer} id="disclaimerContainer">
          <p className={styles.disclaimer}>
            <sup className={styles.superScript}>2</sup> The outcome is subject
            to the ratified scorecard during Phase 4.
          </p>
          <p className={styles.disclaimer}>
            <sup className={styles.superScript}>3</sup> After kickoff, 1 of
            every 10 NFTs minted for each team will be reserved for the Defifa
            Ballkids who developed this game.
          </p>
        </div>

        <br />
      </div>
    </Content>
  );
};

export default Rules;
