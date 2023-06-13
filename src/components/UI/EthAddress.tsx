import { useEnsName } from "hooks/useEnsName";
import Link from "next/link";
import { MouseEventHandler, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { truncateEthAddress } from "utils/format/formatAddress";
import EtherscanLink from "./EtherscanLink";

interface EthAddressProps {
  className?: string;
  address: string | undefined;
  label?: string;
  linkDisabled?: boolean;
  ensDisabled?: boolean;
  onClick?: MouseEventHandler;
  href?: string;
  truncateTo?: number;
}

export function EthAddress({
  className,
  address,
  label,
  href,
  onClick,
  linkDisabled = false,
  ensDisabled = false,
  truncateTo,
}: EthAddressProps) {
  const { data: ensName } = useEnsName(address, { enabled: !ensDisabled });

  const formattedAddress = useMemo(() => {
    if (label) return label;
    if (!ensDisabled && ensName) return ensName;
    if (!address) return null;

    return truncateEthAddress({ address, truncateTo });
  }, [address, ensName, label, ensDisabled, truncateTo]);

  if (!formattedAddress) return null;

  return (
    <span className="inline-flex items-center">
      {linkDisabled ? (
        <span className={twMerge("select-all leading-[22px]", className)}>
          {formattedAddress}
        </span>
      ) : href ? (
        <Link
          href={href}
          className={twMerge(
            "select-all leading-[22px] text-current hover:text-bluebs-500 hover:underline",
            className
          )}
        >
          {formattedAddress}
        </Link>
      ) : (
        <EtherscanLink
          className={twMerge("select-all leading-[22px]", className)}
          onClick={onClick}
          type="address"
          value={address}
        >
          {formattedAddress}
        </EtherscanLink>
      )}
    </span>
  );
}
