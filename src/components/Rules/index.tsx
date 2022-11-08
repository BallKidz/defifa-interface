import Content from "../UI/Content";
import styles from "./index.module.css";

const Rules = () => {
  return (
    <Content title="Rules" open={false} socials={true}>
      <div className={styles.rulesContainer}>
        <div className={styles.phases}>
          <div className={styles.phaseBox}>
            <h1>Phase 1: Mint</h1>
            <ul>
              <li>
                There are 32 teams representing the nations competing at the
                2022 FIFA World Cup.
              </li>
              <li>Mint team NFTs to increase the game’s treasury.</li>
              <li>The NFT’s are a claim on this treasury.</li>
              <li>You can get a full refund anytime before the game starts.</li>
            </ul>
          </div>
          <div className={styles.phaseBox}>
            <h1>Phase 2: Start</h1>
            <ul>
              <li>
                The treasury is locked and minting permenently ends before the
                first kickoff on November 21, 2022 at 2 AM PST
              </li>
              <li>
                Holders of each team’s NFTs benefit from the outcome of each
                world cup game their team plays.
                <a href="#pointsSystem">
                  <sup className={styles.superScript}>1</sup>
                </a>
              </li>
              <li>
                The eventual value of thir NFTs recalibrates depending on the
                outcome.
                <a href="#pointsSystem">
                  <sup className={styles.superScript}>2</sup>
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.phaseBox}>
            <h1>Phase 3: Trade deadline</h1>
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
            <h1>Phase 4: End</h1>
            <ul>
              <li>The game is self refereed.</li>
              <li>
                A final scorecard is uploaded in-chain that says how the game’s
                treasury should be shared.
              </li>
              <li>
                50% of NFT holders from all teams attest to the correct
                scorecard to ratify it.
              </li>
              <li>
                Burn your team’s NFT to reclaim ETH from the game at any time
                after a scorecard has been ratified.
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
              There are 20000 points available each round of the FIFA
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
        <span className={styles.disclaimer}>
          <sup className={styles.superScript}>2</sup> THE OUTCOME IS SUBJECT TO
          THE RATIFIED SCORECARD DURING PHASE 4.
        </span>
        <br />
      </div>
    </Content>
  );
};

export default Rules;
