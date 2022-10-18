import Team from "../Team";
import styles from "./Group.module.css";

interface GroupProps {
  groupName: string;
}

const Group = ({ groupName }: GroupProps) => {
  return (
    <div className={styles.container}>
      <div>
        <label>Group {groupName}</label>
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
