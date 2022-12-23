/* eslint-disable react/no-unescaped-entities */
import { useEffect } from "react";
import { goerliData, mainnetData } from "../../constants/addresses";
import { useProposals } from "../../hooks/read/Scorecards";
import styles from "./Attestation.module.css";

const Attestation = () => {
  const { proposals, loading, error } = useProposals(
    mainnetData.defifaGovernor.address,
    10,
    "id",
    "asc"
  );

  useEffect(() => {
    console.log(proposals);
  }, [proposals]);
  return (
    <div className={styles.attestationContainer}>
      <div className={styles.attestationInfoContainer}>
        <p className={styles.attestationHeader}>Submit scorecard attestation</p>
        <p>
          50% of NFT holders from all teams attest to the correct scorecard to
          ratify it. Each team has 1 vote, divided between all holders of that
          team's NFTs.
        </p>
      </div>
    </div>
  );
};

export default Attestation;
