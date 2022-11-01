import Socials from "../Navbar/Info/Socials";
import styles from "./Description.module.css";

const Description = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gameplayContainer}>
        <p>
          TLDR Gameplay: 1. Mint teams to load the pot. 2. The pot will back the
          value of the winning teams’ NFTs. 3. The spread of winning teams is
          determined by 60% of all teams agreeing on the outcome of the
          competition once it’s over.
        </p>
      </div>
      <div className={styles.infoContainer}>
        <p>
          minting ends & game starts: <span>Nov 20, 2022</span>
        </p>
        <p>
          Trade deadline: <span>Dec 5, 2022</span>
        </p>
        <p>
          Game ends: <span>Dec 20, 2022</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default Description;
