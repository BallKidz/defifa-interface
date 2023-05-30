/* eslint-disable @next/next/no-img-element */
import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import Button from "components/UI/Button";
import { useGameContext } from "contexts/GameContext";
import { useAttestationPower } from "hooks/read/AttestationPower";
import { TeamTier } from "hooks/useMyTeams";
import useRedeemTokensOf from "hooks/write/useRedeemTokensOf";
import { FC, useState } from "react";
import styles from "./MyTeam.module.css";
import { useRefundsOpen } from "./useRefundsOpen";

const MyTeam: FC<{
  team: TeamTier;
  onRedeemSuccess: () => void;
  disableRedeem: boolean;
}> = ({ team, onRedeemSuccess, disableRedeem }) => {
  const { currentPhase } = useGameContext();
  const { id, image, name, quantity } = team;

  const [quantityToRedeem, setQuantityToRedeem] = useState<string[]>(
    team.tokenIds
  );
  const attestationPower = useAttestationPower(id, quantity);
  const canRedeem = useRefundsOpen();

  const buttonText =
    currentPhase === DefifaGamePhase.NO_CONTEST ||
    currentPhase === DefifaGamePhase.NO_CONTEST_INEVITABLE
      ? "Redeem"
      : "Refund";

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
            <Button onClick={increaseQuantity}>+</Button>
            <Button onClick={decreaseQuantity}>-</Button>
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
            <span>{buttonText}</span>
          )}
        </Button>
      )}
    </div>
  );
};

export default MyTeam;
