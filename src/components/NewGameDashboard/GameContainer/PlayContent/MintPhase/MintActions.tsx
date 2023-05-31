import Button from "components/UI/Button";
import { TierSelection } from "./useMintSelection";
import { formatUnits } from "ethers/lib/utils";
import { MINT_PRICE } from "constants/constants";

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

  return (
    <div className="flex justify-between items-center">
      <div>{totalSelected} picks</div>

      <div>{cost} ETH</div>

      <Button size="lg">Mint now</Button>
    </div>
  );
}
