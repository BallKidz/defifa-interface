import { useEnsName } from "hooks/useEnsName";
import Link from "next/link";
import { MouseEventHandler, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { truncateEthAddress } from "utils/format/formatAddress";
import EtherscanLink from "./EtherscanLink";
import Image from "next/image";
import { ensAvatarUrlForAddress } from "utils/ens";

interface EthAddressProps {
  className?: string;
  address: string | undefined;
  label?: string;
  linkDisabled?: boolean;
  ensDisabled?: boolean;
  onClick?: MouseEventHandler;
  href?: string;
  truncateTo?: number;
  withEnsAvatar?: boolean;
  avatarClassName?: string;
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
  withEnsAvatar = false,
  avatarClassName,
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
    <span className="inline-flex items-center gap-2">
      {withEnsAvatar && address && (
        <div className={twMerge("h-9 w-9 flex", avatarClassName)}>
          <Image
            src={ensAvatarUrlForAddress(address, { size: 72 })}
            alt={`Avatar for ${ensName ?? address}`}
            className="rounded-full"
            loading="lazy"
            height={36}
            width={36}
          />
        </div>
      )}
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
