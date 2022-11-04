import Team from "../Team";
import styles from "./Group.module.css";

interface GroupProps {
  groupName: string;
  children: any;
}

const Group = ({ groupName, children }: GroupProps) => {
  return (
    <div className={styles.container}>
      <div>
        <label>{groupName}</label>
      </div>
      <div className={styles.teamContainer}>{children}</div>
    </div>
  );
};

export default Group;
