/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
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
  const [quantityToRedeem, setQuantityToRedeem] = useState<string[]>(
    team.tokenIds
  );
  const { data } = useProjectCurrentFundingCycle();
  const fundingCycle = data?.fundingCycle.number.toNumber();
  const attestationPower = useAttestationPower(id, quantity);
  const canRedeem =
    fundingCycle === 1 || fundingCycle === 2 || fundingCycle === 4;
  const {
    write,
    isLoading: isRedeemLoading,
    isError: isRedeemError,
    error: redeemError,
  } = useRedeemTokensOf({
    tokenIds: quantityToRedeem,
    onSuccess: onRedeemSuccess,
  });

  const increaseQuantity = () => {
    if (quantityToRedeem.length < team.tokenIds.length) {
      setQuantityToRedeem((q) => [...q, team.tokenIds[q.length]]);
    }
  };

  const decreaseQuantity = () => {
    if (quantityToRedeem.length > 1) {
      setQuantityToRedeem((q) => q.slice(0, -1));
    }
  };

  return (
    <div className={styles.container}>
      {/* <IpfsImage hash={image} className={styles.teamImg} /> */}
      <img src={image} alt="defifa nft" className={styles.teamImg} />
      <h3>{name}</h3>
      <div className={styles.quantityContainer}>
        <p>Quantity : {quantityToRedeem.length}</p>
        {quantity > 1 && (
          <>
            <Button size="extraSmall" onClick={increaseQuantity}>
              +
            </Button>
            <Button size="extraSmall" onClick={decreaseQuantity}>
              -
            </Button>
          </>
        )}
      </div>
      <p>Attestation power: {attestationPower}% </p>

      {canRedeem && (
        <Button
          onClick={() => {
            write?.();
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
  if (fundingCycle === 1 || fundingCycle === 2) {
    return "Refund";
  } else if (fundingCycle === 4) {
    return "Redeem";
  } else {
    return "Refund";
  }
}

export default MyTeam;
