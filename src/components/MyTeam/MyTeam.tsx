/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useMemo, useState } from "react";
import { IpfsImage } from "react-ipfs-image";
import { TeamTier } from "../../hooks/useMyTeams";
import styles from "./MyTeam.module.css";
import Button from "../UI/Button";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import useRedeemTokensOf from "../../hooks/write/useRedeemTokensOf";
const MyTeam: FC<{ team: TeamTier }> = ({ team }) => {
  const { id, image, name, quantity } = team;
  const { data } = useProjectCurrentFundingCycle();
  const fundingCycle = data?.fundingCycle.number.toNumber();
  const canRedeem = fundingCycle === 1 || fundingCycle === 4;
  const {
    write,
    isLoading: isRedeemLoading,
    isError: isRedeemError,
    error: redeemError,
  } = useRedeemTokensOf({ tokenIds: team.tokenIds });
  return (
    <div className={styles.container}>
      <IpfsImage hash={image} className={styles.teamImg} />
      <div className={styles.metadata}>
        <h3>{name}</h3>
        <p>Quantity : {quantity}</p>
        <p>Attestation power: 5% </p>
      </div>
      <Button
        onClick={() => {
          write?.();
        }}
        disabled={!canRedeem}
      >
        {isRedeemLoading ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            style={{ marginTop: "5px" }}
            src="/assets/defifa_spinner.gif"
            alt="spinner"
            width={35}
          />
        ) : (
          <span>{getRedeemButtonText(fundingCycle)}</span>
        )}
      </Button>
    </div>
  );
};

export function getRedeemButtonText(fundingCycle?: number) {
  if (fundingCycle === 1) {
    return "Refund";
  } else if (fundingCycle === 4) {
    return "Redeem";
  } else {
    return "Refund";
  }
}

export default MyTeam;
