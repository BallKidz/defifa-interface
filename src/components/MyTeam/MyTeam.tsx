/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { IpfsImage } from "react-ipfs-image";
import { useAttestationPower } from "../../hooks/read/AttestationPower";
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { TeamTier } from "../../hooks/useMyTeams";
import useRedeemTokensOf from "../../hooks/write/useRedeemTokensOf";
import Button from "../UI/Button";
import styles from "./MyTeam.module.css";
const MyTeam: FC<{
  team: TeamTier;
  onRedeemSuccess: () => void;
  disableRedeem: boolean;
}> = ({ team, onRedeemSuccess, disableRedeem }) => {
  const { id, image, name, quantity } = team;
  const { data } = useProjectCurrentFundingCycle();
  const fundingCycle = data?.fundingCycle.number.toNumber();
  const attestationPower = useAttestationPower(id, quantity);
  const canRedeem = fundingCycle === 1 || fundingCycle === 4;
  const {
    write,
    isLoading: isRedeemLoading,
    isError: isRedeemError,
    error: redeemError,
  } = useRedeemTokensOf({
    tokenIds: team.tokenIds,
    onSuccess: onRedeemSuccess,
  });

  return (
    <div className={styles.container}>
      <IpfsImage hash={image} className={styles.teamImg} />
      <h3>{name}</h3>
      <p>Quantity : {quantity}</p>
      <p>Attestation power: {attestationPower}% </p>
      {canRedeem && (
        <Button
          onClick={() => {
            write?.();
            // onRedeemSuccess();
          }}
          disabled={!canRedeem || isRedeemLoading || disableRedeem}
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
      )}
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
