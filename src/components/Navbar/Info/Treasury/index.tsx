import styles from "./Treasury.module.css";

const Treasury = () => {
  return (
    <div className={styles.container}>
      <h1>
        0 eth
        <span> from </span>0 players
      </h1>

      <p>current pot</p>
    </div>
  );
};

export default Treasury;
