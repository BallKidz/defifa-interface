import { BigNumber, BigNumberish } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { EthLogo } from "./EthLogo";
import { twMerge } from "tailwind-merge";

export function EthAmount({
  amountWei,
  className,
  iconClassName,
  precision = 4,
}: {
  amountWei: BigNumberish;
  className?: string;
  iconClassName?: string;
  precision?: number;
}) {
  const formatAmount = (amount: BigNumberish) => {
    if (!amount || BigNumber.from(amount).isZero()) {
      return "0.0";
    }
    
    const ethAmount = formatEther(amount);
    const num = parseFloat(ethAmount);
    
    // For very small amounts, show more decimal places
    if (num < 0.001 && num > 0) {
      // Show up to 8 decimal places for small amounts
      const formatted = num.toFixed(8).replace(/\.?0+$/, '');
      return formatted === '0' ? num.toExponential(2) : formatted;
    }
    
    // For normal amounts, use specified precision
    return num.toFixed(precision).replace(/\.?0+$/, '');
  };

  return (
    <span className={twMerge("inline-flex gap-2 items-center", className)}>
      <EthLogo className={iconClassName} /> {formatAmount(amountWei)}
    </span>
  );
}
