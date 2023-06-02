import Button from "components/UI/Button";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import { MINT_PRICE } from "constants/constants";
import { formatUnits, parseEther } from "ethers/lib/utils";
import { usePay } from "hooks/write/usePay";
import { TierSelection } from "./useMintSelection";
import { useAccount } from "wagmi";
import { constants } from "ethers";

export function MintActions({
  selectedTiers,
}: {
  selectedTiers: TierSelection | undefined;
}) {
  const totalSelected = Object.values(selectedTiers ?? {}).reduce(
    (acc, curr) => acc + curr.count,
    0
  );
  const cost = totalSelected * parseFloat(formatUnits(MINT_PRICE).toString());
  const tierIdsToMint = Object.keys(selectedTiers ?? {}).reduce(
    (acc: number[], tierId) => {
      const tiers = Array(selectedTiers?.[tierId].count).fill(
        parseInt(tierId)
      ) as number[];
      return [...acc, ...tiers];
    },
    []
  );

  const { write, isLoading, isSuccess, isError } = usePay({
    amount: parseEther(cost.toString()).toString(),
    token: ETH_TOKEN_ADDRESS,
    minReturnedTokens: "0",
    preferClaimedTokens: true,
    memo: `Minted on defifa.net`,
    metadata: {
      _votingDelegate: constants.AddressZero,
      tierIdsToMint,
    },
  });

  const picksText = totalSelected === 1 ? "pick" : "picks";

  return (
    <div className="flex justify-between items-center">
      <div>
        {totalSelected} {picksText}
      </div>

      <div>{cost} ETH</div>

      <Button loading={isLoading} size="lg" onClick={() => write?.()}>
        Mint now
      </Button>
    </div>
  );
}
