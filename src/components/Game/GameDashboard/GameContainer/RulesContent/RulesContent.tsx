import EtherscanLink from "components/UI/EtherscanLink";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { useDefaultTokenBeneficiary } from "hooks/read/DefaultTokenBeneficiary";
import { useDeployerDates } from "hooks/read/DeployerDates";
import { useDefifaTiers } from "hooks/read/useDefifaTiers";
import { useMaxTiers } from "hooks/read/MaxTiers";
import { useTierBeneficiaries } from "hooks/read/TierBeneficiaries";
import { useGameMetadata } from "hooks/read/useGameMetadata";
import { useProjectCurrentFundingCycle } from "hooks/read/useProjectCurrentFundingCycle";
import styles from "./index.module.css";
import { EthAddress } from "components/UI/EthAddress";
import { IDefifa_DAO_PROTOCOL_FEE } from "constants/constants";

export function RulesContent() {
  const { metadata, gameId, nfts } = useGameContext();
  const { mintPeriodDuration, start, refundPeriodDuration } = useDeployerDates(
    "local",
    gameId
  );
  const { data: currentFc } = useProjectCurrentFundingCycle(gameId);

  const { data: maxTiers } = useMaxTiers(currentFc?.metadata.dataSource);
  const tierBeneficiary = useTierBeneficiaries(
    currentFc?.metadata.dataSource,
    maxTiers ? Number(maxTiers) : 0
  );
  const currentFcNumber = currentFc?.fundingCycle.number ? Number(currentFc.fundingCycle.number) : undefined;
  const tokenBeneficiary = useDefaultTokenBeneficiary(
    currentFc?.metadata.dataSource
  );
  const { data: nftRewardTiers } = useDefifaTiers(currentFc?.metadata.dataSource);
  const { data: gameMetadata } = useGameMetadata(gameId);

  const fillPill = (phase: number) => {
    if (currentFcNumber === phase) {
      return "Active";
    } else if (currentFcNumber ?? 0 > phase) {
      return "Completed";
    } else if (currentFcNumber ?? 0 < phase) {
      switch (phase) {
        case 1:
          return `${mintPeriodDuration.date}`;
        case 2:
          return `${refundPeriodDuration.date}`;
        case 3:
          return `${start.date}`;
        default:
        // case 4:
        //   return `${end.date}`;
      }
    }
  };

  const pillStyle = (phase: number) => {
    if (currentFcNumber ?? 0 > phase) {
      return styles.completed;
    } else if (currentFcNumber === phase) {
      return styles.active;
    } else {
      return styles.upcoming;
    }
  };

  return (
    <div>
      <p className="mb-5">
        Join a team by minting its NFT (which adds your ETH to a shared pot). The
        winning teams get more of the pot when the game ends.
      </p>

      <p className="mb-5">
        Once NFT minting closes, anyone can score the contest to determine how
        much of the pot goes to each team. At least 50% of teams need to approve
        a set of scores by majority vote – otherwise, the ETH stays in the pot.
      </p>

      <div className="mb-5">
        <EtherscanLink type="address" value={currentFc?.metadata.dataSource}>
          View NFT on Etherscan
        </EtherscanLink>
      </div>
      <div className="border-t border-neutral-800 pt-4 mb-5 flex flex-col gap-2">
        <div>
          <span className="text-pink-500">Phase 1: </span>Mint (minting open,
          refunds open)
          <span className={pillStyle(mintPeriodDuration.phase)}>
            {fillPill(mintPeriodDuration.phase)}
          </span>
        </div>
        <div>
          <span className="text-pink-500">Phase 2: </span>Refund (minting
          closed)
          <span className={pillStyle(refundPeriodDuration.phase)}>
            {fillPill(refundPeriodDuration.phase)}
          </span>
        </div>
        <div>
          <div>
            <span className="text-pink-500">Phase 3: </span>Score (refunds
            closed)
            <span className={pillStyle(start.phase)}>
              {fillPill(start.phase)}
            </span>
          </div>
          <div>
            Anyone can score the game. At least 50% of teams need to approve a
            set of scores by majority vote – otherwise, the ETH stays in the
            pot.
          </div>
        </div>
      </div>
      <div>
        <div className="border-t border-neutral-800 pt-4 mb-5">
          <p>
            <span className="text-pink-500">Winners: </span>Claim rewards at any
            time once a set of scores has been approved. Redeeming an NFT will
            burn it and transfer its share of the pot to you.
          </p>
          <p>
            <span className="text-pink-500">No Contest: </span>
            This occurs when nobody queues the next game phase. Players may
            redeem or keep their NFTs.
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-800 pt-4 mb-5">
        <div className="flex items-center">
          <p>
            <span className="text-pink-500">Protocol support:</span>
            <span className="ml-2">
              {IDefifa_DAO_PROTOCOL_FEE * 100}% of the pot buys Defifa's
              governance tokens for this game's players.
            </span>
          </p>
        </div>
        <div>
          <div className="flex items-center">
            <p>
              <span className="text-pink-500">Reserved Mints:</span>
              {nftRewardTiers?.filter(
                (tier) => Number(tier.reservedRate) > 0
              ).length === 0 ? (
                <span className="ml-2">
                  No NFTs are being reserved by this game's creator.
                </span>
              ) : null}
            </p>
          </div>
          {nftRewardTiers &&
            nftRewardTiers?.filter((tier) => Number(tier?.reservedRate) > 0)
              .length > 0 && (
              <div className="flex flex-wrap">
                {nftRewardTiers
                  ?.filter((tier) => Number(tier.reservedRate) > 0)
                  .map((tier, index) => {
                    const matchingTier = nfts?.tiers?.find(
                      (t) => t.id === Number(tier.id)
                    );
                    const imageSrc = matchingTier ? matchingTier.teamImage : "";

                    return (
                      <div
                        key={Number(tier.id)}
                        className="border-t border-pink-800 pt-4 mb-5"
                      >
                        {/* <Image src={imageSrc} width={100} height={100} alt="" /> */}
                        <p>Pick: {Number(tier.id)}</p>
                        <div className="flex items-center">
                          <span>
                            <EthAddress
                              address={tier.reservedTokenBeneficiary}
                            />
                          </span>
                          <span className="ml-2">
                            will receive{" "}
                            {(1 / (Number(tier.reservedRate) + 1)) * 100}% of
                            this team's NFTs.
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
