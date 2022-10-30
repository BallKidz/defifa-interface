import styles from "./Treasury.module.css";

const Treasury = () => {
  return (
    <div className={styles.container}>
      <h1>
        0 eth
        <span> from</span>
        <span> 0 players</span>
      </h1>

      <p>current pot</p>
    </div>
  );
};

export default Treasury;
