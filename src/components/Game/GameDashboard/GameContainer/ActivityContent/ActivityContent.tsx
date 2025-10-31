import { useMemo } from 'react';
import { EthAddress } from "components/UI/EthAddress";
import Container from "components/layout/Container";
import { constants } from "ethers";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";
import moment from "moment";
import Image from "next/image";
import { useGameActivity, GroupedTransferEvent } from "./useGameActivity";
import { useGameContext } from "contexts/GameContext";
import { useGameNFTAddress } from "hooks/read/useGameNFTAddress";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";
import { formatEther } from "ethers/lib/utils";
import { useCurrentPhaseTitle } from "../PlayContent/useCurrentPhaseTitle";
import { useFarcasterContext } from "hooks/useFarcasterContext";

// Hook to fetch tokenURI from contract
function useTokenURI(tokenNumber: string, nftAddress?: string) {
  const { chainData } = useChainData();
  
  const { data: tokenURI } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "tokenURI",
    args: [BigInt(tokenNumber)],
    chainId: chainData.chainId,
    query: {
      enabled: !!nftAddress && !!tokenNumber,
      refetchInterval: 5 * 1000, // 5 seconds
      staleTime: 0,
    },
  });

  return tokenURI;
}

// Component to display NFT thumbnail
function NFTThumbnail({ tokenNumber, nftAddress }: { tokenNumber: string; nftAddress?: string }) {
  const tokenURI = useTokenURI(tokenNumber, nftAddress);
  
  // Extract tier from token number
  const tier = Math.floor(parseInt(tokenNumber) / DEFAULT_NFT_MAX_SUPPLY);
  
  if (tokenURI && typeof tokenURI === 'string') {
    // Handle different URI types
    if (tokenURI.startsWith("data:")) {
      // Data URI (embedded SVG/image)
      return (
        <div className="rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner aspect-square flex items-center justify-center bg-[#0f0b16]">
          <Image
            className="w-full h-full object-cover"
            src={tokenURI}
            crossOrigin="anonymous"
            alt={`NFT #${tokenNumber}`}
            width={60}
            height={60}
          />
        </div>
      );
    } else if (tokenURI.startsWith("ipfs://")) {
      // IPFS URI - convert to gateway URL
      const ipfsHash = tokenURI.replace("ipfs://", "");
      const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      return (
        <div className="rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner aspect-square flex items-center justify-center bg-[#0f0b16]">
          <Image
            className="w-full h-full object-cover"
            src={gatewayUrl}
            crossOrigin="anonymous"
            alt={`NFT #${tokenNumber}`}
            width={60}
            height={60}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><div class="text-[#fea282] text-lg font-bold">${tier}</div><div class="text-[#c0b3f1] text-xs"></div></div>`;
              }
            }}
          />
        </div>
      );
    } else {
      // Direct URL
      return (
        <div className="rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner aspect-square flex items-center justify-center bg-[#0f0b16]">
          <Image
            className="w-full h-full object-cover"
            src={tokenURI}
            crossOrigin="anonymous"
            alt={`NFT #${tokenNumber}`}
            width={60}
            height={60}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><div class="text-[#fea282] text-lg font-bold">${tier}</div><div class="text-[#c0b3f1] text-xs">Outcome</div></div>`;
              }
            }}
          />
        </div>
      );
    }
  }
  
  // Fallback placeholder
  return (
    <div className="rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner aspect-square flex items-center justify-center bg-[#0f0b16]">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-[#fea282] text-lg font-bold">{tier}</div>
        <div className="text-[#c0b3f1] text-xs">Outcome</div>
      </div>
    </div>
  );
}

function ActivityRow({ transferEvent }: { transferEvent: GroupedTransferEvent }) {
  const time = moment(parseInt(transferEvent.timestamp) * 1000).fromNow();
  const { nftAddress } = useGameNFTAddress(useGameContext().gameId);
  const { metadata, nfts, gameId } = useGameContext();
  const phaseTitle = useCurrentPhaseTitle();
  const { isInMiniApp } = useFarcasterContext();
  const firstTierPrice = nfts.tiers?.[0]?.price;
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
  const gamePath = gameId ? `/game/${gameId}` : undefined;
  const gameUrl = baseUrl && gamePath ? `${baseUrl}${gamePath}` : undefined;
  
  const isMint = transferEvent.action === "Mint";
  const arrowIcon = isMint ? "↑" : "↓";
  const actionText = isMint ? "Mint" : "Redeem";
  const gameName = metadata?.name ?? "this Defifa game";
  
  // Group tokens by tier and count them
  const tierCounts: { [tier: number]: number } = {};
  transferEvent.tokens.forEach(token => {
    const tier = Math.floor(parseInt(token.number) / DEFAULT_NFT_MAX_SUPPLY);
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  });
  
  const uniqueTiers = Object.keys(tierCounts).map(Number).sort();
  const totalNFTs = transferEvent.tokens.length;
  
  return (
    <div className="border-b border-solid border-neutral-900 overflow-hidden text-s py-4">
      <div className="flex items-center gap-4">
        <span className="text-2xl text-gray-400 w-8 text-center">{arrowIcon}</span>

        {transferEvent.nonZeroId && (
          <EthAddress
            withEnsAvatar
            avatarClassName="h-10 w-10"
            address={transferEvent.nonZeroId}
            shareText={
              isInMiniApp && gameUrl
                ? `${isMint ? "Minted" : "Redeemed"} ${totalNFTs} NFT${totalNFTs > 1 ? "s" : ""} ${isMint ? "in" : "for refunds from"} ${gameName}.` +
                  `${phaseTitle ? ` Phase: ${phaseTitle}.` : ""}` +
                  `${formattedPrice ? ` First tier mint price: ${formattedPrice} ETH.` : ""}` +
                  ` Check out the game: ${gameUrl}`
                : undefined
            }
            shareEmbeds={isInMiniApp && gameUrl ? [gameUrl] : undefined}
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
                )?.number || "0"} nftAddress={nftAddress} />
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
      <div className="space-y-2">
        {transfers.map((transferEvent) => (
          <ActivityRow
            key={transferEvent.transactionHash}
            transferEvent={transferEvent}
          />
        ))}
      </div>
    </div>
  );
}
