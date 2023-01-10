/* eslint-disable @next/next/no-img-element */
import styles from "./Conferences.module.css";

interface ConferencesProps {
  name: string;
  logo: string;
  tiers: any[];
  children: any;
}

const Conferences = ({ name, logo, tiers, children }: ConferencesProps) => {
  const teamNamesString = tiers.map((t) => t.teamName).join(", ");
  return (
    <div className={styles.container}>
      <div className={styles.description}>
        <img src={logo} alt="conference" width={250} />
        <p>
          <span className={styles.conferenceName}>{name} conference</span>
          <br></br>
          There are {tiers.length} teams in the {name} conference:{" "}
          {teamNamesString}
        </p>
      </div>

      <div className={styles.teamContainer}>{children}</div>
    </div>
  );
};

export default Conferences;
