/* eslint-disable react/no-unescaped-entities */
import { useDeployerDuration } from "../../hooks/read/DeployerDuration";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import Content from "../UI/Content";
import styles from "./index.module.css";

const Rules = () => {
  const { mint, start, tradeDeadline, end } = useDeployerDuration();
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
          return `${mint.date}`;
        case 2:
          return `${start.date}`;
        case 3:
          return `${tradeDeadline.date}`;
        default:
        case 4:
          return `${end.date}`;
      }
    }
  };

  return (
    <Content title="Rules" open={false} socials={true}>
      <div className={styles.rulesContainer}>
        <div className={styles.phases}>
          <div className={styles.phaseBox}>
            <h1>
              Phase 1: Opening ceremony (Mint start)
              <span
                className={
                  currentFcNumber === 1 ? styles.active : styles.upcoming
                }
              >
                {fillPill(1)}
              </span>
            </h1>
            <ul>
              <li>
                There are 32 teams representing the nations competing at the
                2022 FIFA World Cup.
              </li>
              <li>Mint team NFTs to increase the game’s treasury.</li>
              <li>The NFTs are a claim on this treasury.</li>
              <li>You can get a full refund anytime before the game starts.</li>
            </ul>
          </div>
          <div className={styles.phaseBox}>
            <h1>
              Phase 2: Kickoff (Mint ends)
              <span
                className={
                  currentFcNumber === 2 ? styles.active : styles.upcoming
                }
              >
                {fillPill(2)}
              </span>
            </h1>
            <ul>
              <li>
                The pot is locked and minting permenently ends before the first
                kickoff on November 21, 2022 at 2 AM PST.
                <a href="#pointsSystem">
                  <sup className={styles.superScript}>3</sup>
                </a>
              </li>
              <li>
                Holders of each team’s NFTs benefit from the outcome of each
                world cup game their team plays.
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
              Phase 3: Trade deadline{" "}
              <span
                className={
                  currentFcNumber === 3 ? styles.active : styles.upcoming
                }
              >
                {fillPill(3)}
              </span>
            </h1>
            <ul>
              <li>
                NFTs are not transferable from the trade deadline until the
                game’s end.
              </li>
              <li>
                The trade deadline coincides with the start of the quarter
                finals.
              </li>
            </ul>
          </div>
          <div className={styles.phaseBox}>
            <h1>
              Phase 4: Final whistle{" "}
              <span
                className={
                  currentFcNumber === 4 ? styles.active : styles.upcoming
                }
              >
                {fillPill(4)}
              </span>
            </h1>
            <ul>
              <li>The game is self refereed.</li>
              <li>
                A final scorecard is uploaded on-chain that says how the game’s
                treasury should be shared.
              </li>
              <li>
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
          <div>
            <p className={styles.pointSystemDescription}>
              There are 20,000 points available each round of the FIFA
              tournament, divided evenly between the winner of each game in the
              round. There are 48 group stage games total, 8 round of 16 games,
              4 quarterfinal, 2 semifina, and 1 final.
            </p>
            <div className={styles.pointSystemCalculation}>
              <p>
                Each group stage:{" "}
                <span className={styles.pointSystemPoints}>417</span>
              </p>
              <p>
                Each round of 16:{" "}
                <span className={styles.pointSystemPoints}>2,500</span>
              </p>
              <p>
                Each quarterfinal:{" "}
                <span className={styles.pointSystemPoints}>5,000</span>
              </p>
              <p>
                Each semifinal:{" "}
                <span className={styles.pointSystemPoints}>10,000</span>
              </p>
              <p>
                The final:{" "}
                <span className={styles.pointSystemPoints}>20,000</span>
              </p>
            </div>
            <p className={styles.pointSystemDescription}>
              The scorecard that is ratified should represent the amount of
              accumulated points by each team divided by the total available
              100,000 points.
            </p>
          </div>
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
