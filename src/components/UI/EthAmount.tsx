import { BigNumberish } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { EthLogo } from "./EthLogo";
import { twMerge } from "tailwind-merge";

export function EthAmount({
  amountWei,
  className,
}: {
  amountWei: BigNumberish;
  className?: string;
}) {
  return (
    <span className={twMerge("inline-flex gap-2 items-center", className)}>
      <EthLogo /> {formatEther(amountWei)}
    </span>
  );
}
