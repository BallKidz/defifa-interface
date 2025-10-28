import Button from "components/UI/Button";
import { useRedeemTokensOf } from "hooks/write/useRedeemTokensOf";

export function RefundActions({
  tokenIdsToRedeem,
  onSuccess,
}: {
  tokenIdsToRedeem: string[];
  onSuccess?: () => void;
}) {
  const totalSelected = tokenIdsToRedeem?.length ?? 0;

  const { write, isLoading } = useRedeemTokensOf({
    tokenIds: tokenIdsToRedeem,
    onSuccess,
  });

  const picksText = totalSelected === 1 ? "pick" : "picks";

  return (
    <div className="flex justify-between items-center w-full">
      <div>
        {totalSelected} {picksText} to refund
      </div>

      <Button loading={isLoading} size="lg" onClick={() => write?.()}>
        Refund
      </Button>
    </div>
  );
}
