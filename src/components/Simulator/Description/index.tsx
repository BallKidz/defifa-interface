import styles from "./SimulatorDescription.module.css";

const SimulatorDescription = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gameplayContainer}>
        <p>
          Interim results of the tournament. The amounts below represent the expected claim on the treasury by NFT. 
          The final amount each NFT holder may claim on the treasury is subject to the attestation of results by participants.
        </p>
      </div>
    </div>
  );
};

export default SimulatorDescription;
