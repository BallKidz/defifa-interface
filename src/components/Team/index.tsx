import styles from "./Team.module.css";

interface TeamProps {
  metadata: any;
}

const Team = () => {
  return (
    <div className={styles.container}>
      <img src="/assets/test.png" alt="Team" width="256" height="75" />
      <h3>Ecuador</h3>
      <p>
        # of mints: 200 <span>(2% of total)</span>
      </p>
    </div>
  );
};

export default Team;
