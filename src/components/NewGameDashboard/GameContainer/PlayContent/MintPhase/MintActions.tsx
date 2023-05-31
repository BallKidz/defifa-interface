import Button from "components/UI/Button";
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

  return (
    <div className="flex justify-between items-center">
      <div>{totalSelected} picks</div>
      <Button>Mint</Button>
    </div>
  );
}
