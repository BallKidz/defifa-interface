import { BigNumberish } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { EthLogo } from "./EthLogo";
import { twMerge } from "tailwind-merge";

export function EthAmount({
  amountWei,
  className,
  iconClassName,
}: {
  amountWei: BigNumberish;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={twMerge("inline-flex gap-2 items-center", className)}>
      <EthLogo className={iconClassName} /> {formatEther(amountWei)}
    </span>
  );
}
