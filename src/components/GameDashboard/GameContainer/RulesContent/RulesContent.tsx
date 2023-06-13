import { EthAddress } from "components/UI/EthAddress";
import EtherscanLink from "components/UI/EtherscanLink";
import { Pill } from "components/UI/Pill";
import { useGameContext } from "contexts/GameContext";
import { useDefaultTokenBeneficiary } from "hooks/read/DefaultTokenBeneficiary";
import { useDeployerDates } from "hooks/read/DeployerDates";
import { useTiersOf } from "hooks/read/JB721Delegate/useTiersOf";
import { useMaxTiers } from "hooks/read/MaxTiers";
import { useTierBeneficiaries } from "hooks/read/TierBeneficiaries";
import { useGameMetadata } from "hooks/read/useGameMetadata";
import { useProjectCurrentFundingCycle } from "hooks/read/useProjectCurrentFundingCycle";

export function RulesContent() {
  const { metadata, gameId, nfts } = useGameContext();
  const { mintDuration, start, refundDuration } = useDeployerDates("local");
  const { data: currentFc } = useProjectCurrentFundingCycle(gameId);

  const { data: maxTiers } = useMaxTiers(currentFc?.metadata.dataSource);
  const tierBeneficiary = useTierBeneficiaries(
    currentFc?.metadata.dataSource,
    maxTiers?.toNumber()
  );
  const currentFcNumber = currentFc?.fundingCycle.number.toNumber();
  const tokenBeneficiary = useDefaultTokenBeneficiary(
    currentFc?.metadata.dataSource
  );
  const { data: nftRewardTiers } = useTiersOf(currentFc?.metadata.dataSource);
  const { data: gameMetadata } = useGameMetadata(gameId);

  const fillPill = (phase: number) => {
    if (currentFcNumber === phase) {
      return "Active";
    } else if (currentFcNumber ?? 0 > phase) {
      return "Completed";
    } else if (currentFcNumber ?? 0 < phase) {
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

  return (
    <div>
      <p className="mb-5">{metadata?.description}</p>
      <div className="mb-5">
        <EtherscanLink type="address" value={currentFc?.metadata.dataSource}>
          View NFT on Etherscan
        </EtherscanLink>
      </div>
      <div className="mb-5 flex flex-col gap-2">
        <div>
          <span className="text-pink-500">Phase 1: </span>MINTS OPEN (mints
          open, refunds open)
          <Pill size="sm">{fillPill(mintDuration.phase)}</Pill>
        </div>
        <div>
          <span className="text-pink-500">Phase 2: </span>REFUNDS OPEN (mints
          closed)
          <Pill size="sm">{fillPill(refundDuration.phase)}</Pill>
        </div>
        <div>
          <div>
            <span className="text-pink-500">Phase 3: </span>SCORING (refunds
            closed)
            <Pill size="sm">{fillPill(start.phase)}</Pill>
          </div>
          <div>
            Anyone may submit a scorecard. Scorecards must be ratified by a
            majority of the Players.
          </div>
        </div>
      </div>
      <div className="py-4 border-t border-gray-800 rounded-lg mb-5">
        <p>
          <span className="text-pink-500">Winners: </span>Claim prize anytime
          after a scorecard has been ratified. Redeeming a player card will burn
          it and transfer you its share of the pot.
        </p>
        <p>
          <span className="text-pink-500">No Contest: </span>
          This occurs when nobody queues the next game phase. Players may
          redeemed or keep their playing cards.
        </p>
      </div>
      <div className="mb-5 py-4 border-t border-gray-800">
        <div className="flex items-center">
          <span className="text-pink-500">Mint Fees:</span>
          {metadata?.seller_fee_basis_points === 0 ? (
            <span className="ml-2">No fees are collected</span>
          ) : (
            <>
              {/* <EthAddress address={metadata?.fee_recipient} /> */}
              <EthAddress address={tokenBeneficiary?.toString()} />
              <span className="ml-2">
                collects a {metadata?.seller_fee_basis_points}% fee on each pick
                minted.
              </span>
            </>
          )}
        </div>
        <div>
          <div className="flex items-center">
            <span className="text-pink-500">Reserved Mints:</span>
            {nftRewardTiers?.filter((tier) => tier.reservedRate.toNumber() > 0)
              .length === 0 ? (
              <p className="ml-2">No reserve tokens are minted in this game</p>
            ) : null}
          </div>
          {nftRewardTiers &&
            nftRewardTiers?.filter((tier) => tier?.reservedRate.toNumber() > 0)
              .length > 0 && (
              <div className="flex flex-wrap">
                {nftRewardTiers
                  ?.filter((tier) => tier.reservedRate.toNumber() > 0)
                  .map((tier, index) => {
                    const matchingTier = nfts?.tiers?.find(
                      (t) => t.id === tier.id.toNumber()
                    );
                    const imageSrc = matchingTier ? matchingTier.teamImage : "";

                    return (
                      <div
                        key={tier.id.toNumber()}
                        className="p-4 border border-pink-800 rounded-lg mb-5"
                      >
                        {/* <Image src={imageSrc} width={100} height={100} alt="" /> */}
                        <p>Pick: {tier.id.toNumber()}</p>
                        <div className="flex items-center">
                          <span>
                            <EthAddress
                              address={tier.reservedTokenBeneficiary}
                            />
                          </span>
                          <span className="ml-2">
                            will receive{" "}
                            {(1 / (tier.reservedRate.toNumber() + 1)) * 100}% of
                            this pick's tokens.
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
