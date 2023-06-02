/* eslint-disable react/no-unescaped-entities */
import Container from "components/UI/Container";
import { useGameContext } from "contexts/GameContext";
import { useDeployerDates } from "hooks/read/DeployerDates";
import { useGameMetadata } from "hooks/read/GameMetadata";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";
import styles from "./index.module.css";
import { useMaxTiers } from "hooks/read/MaxTiers";
import { useTierBeneficiaries } from "hooks/read/TierBeneficiaries";
import { useDefaultTokenBeneficiary } from "hooks/read/DefaultTokenBeneficiary";
import { useNftRewardTiersOf } from "hooks/read/NftRewardsTiers";

export function RulesContent() {
  const { metadata } = useGameContext();
  const { mintDuration, start, refundDuration } = useDeployerDates("local");
  const { gameId } = useGameContext();
  const { data: currentFc } = useProjectCurrentFundingCycle(gameId);
  console.log(currentFc.metadata.dataSource);
  const { data: maxTiers } = useMaxTiers(currentFc.metadata.dataSource);
  console.log("Max tiers ", maxTiers?.toNumber());
  const tierBeneficiary = useTierBeneficiaries(
    currentFc.metadata.dataSource,
    maxTiers?.toNumber()
  );
  console.log("Reserved tokens per tier ", tierBeneficiary);
  // TODO: loop through tiers and get the max reserved tokens
  const currentFcNumber = currentFc?.fundingCycle.number.toNumber();
  const tokenBeneficiary = useDefaultTokenBeneficiary(
    currentFc.metadata.dataSource
  );
  console.log("Default beneficiary ", tokenBeneficiary);
  const { data: nftRewardTiers } = useNftRewardTiersOf(
    currentFc.metadata.dataSource
  );
  console.log("NFT reward tiers ", nftRewardTiers); // Use this for tier beneficiaries

  const { data: gameMetadata } = useGameMetadata(gameId);
  console.log("Game metadata ", gameMetadata);
  const fillPill = (phase: number) => {
    if (currentFcNumber === phase) {
      return "Active";
    } else if (currentFcNumber > phase) {
      return "Completed";
    } else if (currentFcNumber < phase) {
      switch (phase) {
        case 1:
          return `${mintDuration.date}`;
        case 2:
          return `${refundDuration.date}`;
        case 3:
          return `${start.date}`;
        default:
        // case 4:
        //   return `${end.date}`;
      }
    }
  };

  const pillStyle = (phase: number) => {
    if (currentFcNumber > phase) {
      return styles.completed;
    } else if (currentFcNumber === phase) {
      return styles.active;
    } else {
      return styles.upcoming;
    }
  };

  return (
    <Container>
      <p>{metadata?.description}</p>
      <div className={styles.container}>
        <div>
          Phase 1: Minting (mints open, refunds open)
          <span className={pillStyle(mintDuration.phase)}>
            {fillPill(mintDuration.phase)}
          </span>
        </div>
        <div>
          Phase 2: Delay (mints closed)
          <span className={pillStyle(refundDuration.phase)}>
            {fillPill(refundDuration.phase)}
          </span>
        </div>
        <div>
          Phase 3: Game time (refunds closed)
          <span className={pillStyle(start.phase)}>
            {fillPill(start.phase)}
          </span>
        </div>
        <div>
          Phase 4: Scorecard submission. Anyone may submit a scorecard.
          Scorecards must be ratified by a majority of the Players.
        </div>
      </div>
      <div>
        <div className={styles.container}>
          <p>
            Winners: Claim prize anytime after a scorecard has been ratified.
            Redeeming a player card will burn it and transfer you its share of
            the pot.
          </p>
          <p>
            No Contest: This occurs when nobody queues the next game phase.
            Players may redeemed or keep their playing cards.
          </p>
        </div>
      </div>
      <div className={styles.container}>
        <p>
          Mint fees: {metadata?.seller_fee_basis_points}% is collected from
          Players on each playing card minted.
        </p>
        {/* TODO: test with RR and Benef. Create flow borking atm */}
        <p>
          Beneficiaries:{" "}
          {tokenBeneficiary.data as unknown as string ===
          "0x0000000000000000000000000000000000000000"
            ? "No playing cards are being allocated to a default beneficiary in this game."
            : `See contract ${currentFc.metadata.dataSource} for more info about beneficiaries by playing card (tier).`}
        </p>
      </div>
    </Container>
  );
}
