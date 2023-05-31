import Button from "components/UI/Button";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import { MINT_PRICE } from "constants/constants";
import { formatUnits, parseEther } from "ethers/lib/utils";
import { usePay } from "hooks/write/usePay";
import { TierSelection } from "./useMintSelection";
import useRedeemTokensOf from "hooks/write/useRedeemTokensOf";

export function RefundActions({
  tokenIdsToRedeem,
}: {
  tokenIdsToRedeem: string[];
}) {
  const totalSelected = tokenIdsToRedeem?.length ?? 0;

  const { write } = useRedeemTokensOf({
    tokenIds: tokenIdsToRedeem,
  });

  const picksText = totalSelected === 1 ? "pick" : "picks";

  return (
    <div className="flex justify-between items-center">
      <div>
        {totalSelected} {picksText} to refund
      </div>

      <Button size="lg" onClick={() => write?.()}>
        Refund
      </Button>
    </div>
  );
}
