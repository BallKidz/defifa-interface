import { PickCard } from "components/UI/PickCard";
import { useGameContext } from "contexts/GameContext";
import { EthAddress } from "components/UI/EthAddress";
import { zeroAddress } from "viem";

interface ReservedTierCardProps {
  tierId: number;
  reservedCount: number;
  selectedCount: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function ReservedTierCard({
  tierId,
  reservedCount,
  selectedCount,
  onIncrement,
  onDecrement,
}: ReservedTierCardProps) {
  const {
    nfts: { tiers },
  } = useGameContext();

  // Get tier info (tiers are 0-indexed, tierId is 1-indexed)
  const tier = tiers?.[tierId - 1];
  const teamName = tier?.teamName || `Tier ${tierId}`;
  const teamImage = tier?.teamImage;
  const reserveFrequency = tier?.reserveFrequency ?? 0;
  const beneficiaryValue = tier?.reserveBeneficiary;
  const zeroAddr = zeroAddress.toLowerCase();
  const reserveBeneficiary =
    beneficiaryValue &&
    beneficiaryValue.toLowerCase() !== zeroAddr
      ? beneficiaryValue
      : undefined;
  const hasReserveRule = reserveFrequency > 0 && reserveBeneficiary;

  const ruleDescription = hasReserveRule
    ? reserveFrequency === 1
      ? "Every mint issues an NFT to"
      : `Every ${formatOrdinal(reserveFrequency)} mint issues an NFT to`
    : "No reserved mint rule";

  return (
    <PickCard
      title={teamName}
      imageSrc={teamImage || ""}
      selectedCount={selectedCount}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      selectionLimit={reservedCount}
      extra={
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="text-sm text-pink-500 font-medium">
            {reservedCount} Reserved
          </div>
          <div className="text-xs text-neutral-400">Available to mint</div>
          <div className="text-xs text-neutral-400">
            {hasReserveRule ? (
              <>
                {ruleDescription}{" "}
                <EthAddress
                  address={reserveBeneficiary}
                  className="text-neutral-200"
                  truncateTo={4}
                />
              </>
            ) : (
              ruleDescription
            )}
          </div>
        </div>
      }
    />
  );
}

function formatOrdinal(n: number) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return `${n}th`;
  }

  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
