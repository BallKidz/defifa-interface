import { useCallback, useEffect, useMemo, useState } from "react";
import { EthAddress } from "components/UI/EthAddress";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/read/useDefifaTiers";
import moment from "moment";
import Image from "next/image";
import { useGameActivity, GroupedTransferEvent } from "./useGameActivity";
import { useGameContext } from "contexts/GameContext";
import { formatEther } from "ethers/lib/utils";
import { useCurrentPhaseTitle } from "../PlayContent/useCurrentPhaseTitle";
import { useFarcasterContext } from "hooks/useFarcasterContext";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";
import { buildGamePath } from "lib/networks";
import { truncateEthAddress } from "utils/format/formatAddress";
import { useChainData } from "hooks/useChainData";

// Note: teamImage from useDefifaTiers is already resolved (data URI or HTTP URL)
// No additional processing needed - use it directly

// Component to display NFT thumbnail
function NFTThumbnail({ tokenNumber }: { tokenNumber: string }) {
  const { nfts } = useGameContext();
  const tierId = Math.floor(parseInt(tokenNumber) / DEFAULT_NFT_MAX_SUPPLY);
  const tier = nfts.tiers?.find(t => t.id === tierId);
  const imageUrl = tier?.teamImage;
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  const handleError = () => {
    setHasError(true);
  };

  if (imageUrl && !hasError) {
    return (
      <div className="relative h-14 w-14 rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner bg-[#0f0b16]">
        <div className="relative h-full w-full overflow-hidden rounded-[4px]">
          <Image
            fill
            sizes="56px"
            className="object-cover"
            src={imageUrl}
            alt={`NFT #${tokenNumber}`}
            onError={handleError}
          />
        </div>
      </div>
    );
  }

  // Fallback placeholder
  return (
    <div className="relative h-14 w-14 rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner bg-[#0f0b16]">
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="text-[#fea282] text-lg font-bold">{tierId}</div>
        <div className="text-[#c0b3f1] text-xs">Outcome</div>
      </div>
    </div>
  );
}

function ActivityRow({ transferEvent }: { transferEvent: GroupedTransferEvent }) {
  const time = moment(parseInt(transferEvent.timestamp) * 1000).fromNow();
  const { gameId, metadata, nfts } = useGameContext();
  const { chainData } = useChainData();
  const phaseTitle = useCurrentPhaseTitle();
  const { isInMiniApp } = useFarcasterContext();
  const { triggerSelection } = useMiniAppHaptics();
  const firstTierPrice = nfts.tiers?.[0]?.price;
  const primaryTokenNumber = transferEvent.tokens[0]?.number;
  
  // Get tier image from already-parsed tier data (teamImage is already resolved by useDefifaTiers)
  const primaryTierId = primaryTokenNumber ? Math.floor(parseInt(primaryTokenNumber) / DEFAULT_NFT_MAX_SUPPLY) : undefined;
  const primaryTier = primaryTierId ? nfts.tiers?.find(t => t.id === primaryTierId) : undefined;
  const primaryImageUrl = primaryTier?.teamImage;
  const formattedPrice = useMemo(() => {
    if (!firstTierPrice) return undefined;

    try {
      const asNumber = Number(formatEther(firstTierPrice));
      if (Number.isFinite(asNumber)) {
        return asNumber.toLocaleString(undefined, {
          maximumFractionDigits: 4,
        });
      }
    } catch (error) {
      console.warn("Failed to format tier price for sharing copy:", error);
    }

    return formatEther(firstTierPrice);
  }, [firstTierPrice]);

  const originFromEnv =
    process.env.NEXT_PUBLIC_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : undefined);
  const runtimeOrigin =
    typeof window !== "undefined" ? window.location.origin : undefined;
  const baseUrl = originFromEnv ?? runtimeOrigin;
  const gamePath = buildGamePath(chainData.chainId, gameId);
  const gameUrl = baseUrl ? `${baseUrl}${gamePath}` : undefined;
  
  const isMint = transferEvent.action === "Mint";
  const actionText = isMint ? "Mint" : "Redeem";
  const gameName = metadata?.name ?? "this Defifa game";
  const shareMediaUrl = useMemo(
    () => primaryImageUrl,
    [primaryImageUrl]
  );
  const shareEmbeds = useMemo(() => {
    if (!isInMiniApp) return undefined;

    const embeds: string[] = [];
    if (gameUrl) embeds.push(gameUrl);
    if (shareMediaUrl && !embeds.includes(shareMediaUrl)) embeds.push(shareMediaUrl);

    if (embeds.length === 0) return undefined;
    if (embeds.length === 1) {
      return [embeds[0]] as [string];
    }
    return [embeds[0], embeds[1]] as [string, string];
  }, [gameUrl, isInMiniApp, shareMediaUrl]);
  
  // Group tokens by tier and count them
  const tierCounts: { [tier: number]: number } = {};
  transferEvent.tokens.forEach(token => {
    const tier = Math.floor(parseInt(token.number) / DEFAULT_NFT_MAX_SUPPLY);
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  });
  
  const uniqueTiers = Object.keys(tierCounts).map(Number).sort();
  const totalNFTs = transferEvent.tokens.length;
  const shareTextBuilder = useMemo(() => {
    if (!isInMiniApp || !gameUrl) return undefined;

    return ({
      username,
      address,
      defaultText,
    }: {
      username?: string;
      address?: string;
      defaultText?: string;
    }) => {
      const mention = username
        ? `⚡️ @${username}`
        : address
        ? truncateEthAddress({ address })
        : defaultText && defaultText.length > 0
        ? defaultText
        : "A player";
      const actionVerb = isMint ? "collected" : "redeemed";
      const nftCount = `${totalNFTs} NFT${totalNFTs > 1 ? "s" : ""}`;
      const phaseInfo = phaseTitle ? `🏆 Game Phase: ${phaseTitle}` : "";
      const priceInfo = formattedPrice
        ? `💰 Collect NFTs to join a teams: ${formattedPrice} ETH`
        : "";

      return `${mention} ${actionVerb} ${nftCount} ${
        isMint ? "in" : "for refunds from"
      } ${gameName}\n${phaseInfo}\n${priceInfo} \n\n👉 ${gameUrl}`;
    };
  }, [
    isInMiniApp,
    gameUrl,
    isMint,
    totalNFTs,
    phaseTitle,
    formattedPrice,
    gameName,
  ]);
  
  const handleRowClick = useCallback(() => {
    void triggerSelection();
  }, [triggerSelection]);

  return (
    <div
      className="border-b border-solid border-neutral-900 overflow-hidden text-s py-3 min-w-[640px] flex-shrink-0"
      onClickCapture={handleRowClick}
    >
      <div className="flex items-center gap-4">
        {transferEvent.nonZeroId && (
          <EthAddress
            withEnsAvatar
            avatarClassName="h-10 w-10"
            address={transferEvent.nonZeroId}
            shareText={shareTextBuilder}
            shareEmbeds={shareEmbeds}
          />
        )}
        
        <span className="text-pink-500 text-sm">{time}</span>
        
        <div className="flex items-center gap-2">
            
          <div className="bg-lime-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            {totalNFTs}
          </div>
        </div>
        
        <span className="text-gray-300 font-medium">{actionText}</span>
        
          <div className="flex gap-1">
            {uniqueTiers.slice(0, 4).map((tier) => (
              <div key={tier} className="relative">
                <NFTThumbnail tokenNumber={transferEvent.tokens.find(t => 
                  Math.floor(parseInt(t.number) / DEFAULT_NFT_MAX_SUPPLY) === tier
                )?.number || "0"} />
                {tierCounts[tier] > 1 && (
                  <div className="absolute -top-1 -right-1 bg-lime-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium min-w-[18px] text-center">
                    {tierCounts[tier]}
                  </div>
                )}
              </div>
            ))}
            {uniqueTiers.length > 4 && (
              <div className="w-[60px] h-[60px] bg-gray-700 rounded-md flex items-center justify-center text-white text-xs border border-gray-600">
                +{uniqueTiers.length - 4}
              </div>
            )}
          </div>



      </div>
    </div>
  );
}

export function ActivityContent() {
  const { data: activity, isLoading } = useGameActivity();
  const { isInMiniApp } = useFarcasterContext();
  const transfers = (activity as { transfers?: GroupedTransferEvent[] })?.transfers;
  
  if (isLoading) {
    return <div>Loading activity...</div>;
  }

  if (!transfers || transfers.length === 0) {
    return <div>No activity yet.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="overflow-x-auto pb-2">
        <div className="space-y-1 min-w-[640px]">
          {transfers.map((transferEvent) => (
            <ActivityRow
              key={transferEvent.transactionHash}
              transferEvent={transferEvent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
