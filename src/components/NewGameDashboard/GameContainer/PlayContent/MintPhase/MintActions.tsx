import Button from "components/UI/Button";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import { MINT_PRICE } from "constants/constants";
import { formatUnits, parseEther } from "ethers/lib/utils";
import { usePay } from "hooks/write/usePay";
import { TierSelection } from "./useMintSelection";

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
      _votingDelegate: "0xa13d49fCbf79EAF6A0a58cBDD3361422DB4eAfF1", // TODO add input field somewhere
      tierIdsToMint,
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div>{totalSelected} picks</div>

      <div>{cost} ETH</div>

      <Button size="lg" onClick={() => write?.()}>
        Mint now
      </Button>
    </div>
  );
}
