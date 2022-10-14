import Team from "../Team";
import styles from "./Group.module.css";

const Group = () => {
  return (
    <div className={styles.container}>
      <div>
        <label>Group A</label>
      </div>
      <div className={styles.teamContainer}>
        <Team />
        <Team />
        <Team />
        <Team />
      </div>
    </div>
  );
};

export default Group;
