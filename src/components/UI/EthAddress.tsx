import { useEnsName } from "hooks/useEnsName";
import { useFarcasterProfiles } from "hooks/useFarcasterProfiles";
import Link from "next/link";
import { MouseEventHandler, useMemo } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useFarcasterContext } from "hooks/useFarcasterContext";
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
  shareText?: string;
  shareEmbeds?: [] | [string] | [string, string];
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
  shareText,
  shareEmbeds,
}: EthAddressProps) {
  const { isInMiniApp } = useFarcasterContext();
  const { data: ensName } = useEnsName(address, { enabled: !ensDisabled });
  const { data: farcasterData } = useFarcasterProfiles(
    address ? [address] : []
  );
  const farcasterProfile = useMemo(() => {
    if (!address || !farcasterData) return undefined;
    const profile = farcasterData[address.toLowerCase()];
    return profile?.[0];
  }, [address, farcasterData]);

  const formattedAddress = useMemo(() => {
    if (label) return label;
    if (farcasterProfile?.username) return `@${farcasterProfile.username}`;
    if (!ensDisabled && ensName) return ensName;
    if (!address) return null;

    return truncateEthAddress({ address, truncateTo });
  }, [address, ensName, farcasterProfile?.username, label, ensDisabled, truncateTo]);

  if (!formattedAddress) return null;

  const avatarUrl = farcasterProfile?.pfp_url;

  const handleAvatarClick: MouseEventHandler<HTMLDivElement> = async (event) => {
    if (!isInMiniApp || !farcasterProfile?.username) return;

    event.preventDefault();
    event.stopPropagation();

    const text = shareText ?? `@${farcasterProfile.username} 👋`;

    try {
      await sdk.actions.composeCast({
        text,
        embeds: shareEmbeds,
      });
    } catch (error) {
      console.warn("Failed to compose Farcaster cast:", error);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      {withEnsAvatar && address && (
        <div
          className={twMerge(
            "h-9 w-9 flex",
            avatarClassName,
            isInMiniApp && !!farcasterProfile?.username ? "cursor-pointer" : ""
          )}
          onClick={handleAvatarClick}
          role={isInMiniApp && farcasterProfile?.username ? "button" : undefined}
          tabIndex={isInMiniApp && farcasterProfile?.username ? 0 : undefined}
        >
          <Image
            src={avatarUrl || ensAvatarUrlForAddress(address, { size: 72 })}
            alt={`Avatar for ${farcasterProfile?.username ?? ensName ?? address}`}
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
