import { useState, useEffect } from 'react';
import { EthAddress } from "components/UI/EthAddress";
import Container from "components/layout/Container";
import { constants } from "ethers";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";
import moment from "moment";
import Image from "next/image";
import { useGameActivity } from "./useGameActivity";

interface TransferEvent {
  tier: number;
  from: {
    id: string;
  };
  to: {
    id: string;
  };
  token: {
    number: string;
    metadata: {
      image: string;
      name: string;
    };
  };
  transactionHash: string;
  timestamp: string;
}

type ActivityEvent = TransferEvent & {
  action: "Mint" | "Redeem";
  nonZeroId: string;
};

function RedeemEvent({ transferEvent }: { transferEvent: TransferEvent }) {
  return (
    <div className="flex justify-between">
      <div>
        <div className="border border-solid border-neutral-800 block rounded-lg overflow-hidden">
          {transferEvent.from.id && (
            <EthAddress address={transferEvent.from.id} />
          )}
          {!transferEvent.from.id && <div>{transferEvent.from.id}</div>}

          <div>
            <span className="text-lg">&#x2191;</span>
            Minted {transferEvent.token.metadata.name}{" "}
            {moment(parseInt(transferEvent.timestamp) * 1000).fromNow()}
          </div>
          <Image
            className=""
            src={transferEvent.token.metadata.image}
            crossOrigin="anonymous"
            alt="Team"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
}

function PayEvent({ transferEvent }: { transferEvent: TransferEvent }) {
  const time = moment(parseInt(transferEvent.timestamp) * 1000).fromNow();
  console.log(transferEvent);
  return (
    <div className="border-b border-solid border-neutral-900 overflow-hidden text-s py-2">
      <div className="flex items-center justify-between">
        <span className="text-2xl">&#x2191;</span> {/* Increased text size */}
        <div className="rounded-lg ml-4 border-lime-900 border inline-flex overflow-hidden p-1">
          <Image
            className="rounded-md"
            src={transferEvent.token.metadata.image}
            crossOrigin="anonymous"
            alt="Team"
            width={60}
            height={60}
          />
        </div>
        <span className="ml-4">Minted by {/* {transferEvent.token.metadata.name} */}</span>
        {transferEvent.to.id && (
          <EthAddress
            withEnsAvatar
            avatarClassName="h-10 w-10"
            address={transferEvent.to.id}
          />
        )}
        <span className="text-pink-500 ml-4">{time}</span>
      </div>
    </div>
  );

}

function ActivityItem({ transferEvent }: { transferEvent: TransferEvent }) {
  // if (transferEvent.to.id === constants.AddressZero) {
  //   return <RedeemEvent transferEvent={transferEvent} />;
  // }
  if (transferEvent.from.id === constants.AddressZero) {
    return <PayEvent transferEvent={transferEvent} />;
  }

  return null;
}

export function ActivityContent() {
  const { data: activity, isLoading } = useGameActivity();
  const transfers = (activity as { transfers?: any })?.transfers;
  //const transfers = activity?.transfers;
  if (isLoading) {
    return <div>...</div>;
  }

  if (!transfers || transfers.length === 0) {
    return <div>No activity yet.</div>;
  }

  const reformattedArray: ActivityEvent[] = transfers.map((obj: TransferEvent) => {
    const activityEvent = { ...obj } as ActivityEvent; // Typecast activityEvent as ActivityEvent
    const fromId = activityEvent.from.id;
    const toId = activityEvent.to.id;
    const tiers = [...new Set([activityEvent.tier])]; // Use activityEvent.tier directly
    console.log(tiers);
    if (toId === constants.AddressZero) {
      (activityEvent as ActivityEvent).action = "Redeem";
      (activityEvent as ActivityEvent).nonZeroId = fromId;
    } else if (fromId === constants.AddressZero) {
      (activityEvent as ActivityEvent).action = "Mint";
      (activityEvent as ActivityEvent).nonZeroId = toId;
    }

    obj.tier = Math.floor(parseInt(obj.token.number) / DEFAULT_NFT_MAX_SUPPLY);

    return obj;
  });
  const uniqueActionTiers = Array.from(new Set(reformattedArray.map(transferEvent => `${transferEvent.action}-${transferEvent.tier}`)));

  const columns: Record<string, number> = {};
  reformattedArray.forEach((transferEvent) => {
    const { action, nonZeroId } = transferEvent as ActivityEvent;
    if (action && nonZeroId) {
      columns[action] = columns[action] ? columns[action] + 1 : 1;
      columns[nonZeroId] = columns[nonZeroId] ? columns[nonZeroId] + 1 : 1;
    }
  });

  const sortedArray = reformattedArray.sort(
    (a, b) => parseInt(a.timestamp) - parseInt(b.timestamp)
  );
  let runningTotal = 0;

  return (
    <div >
      <table>
        <tbody>
          {reformattedArray
            .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp))
            .map((transferEvent) => {
              const transferEventWithTier = {
                ...transferEvent,
              };
              console.log(transferEventWithTier);
              /*   if (transferDirection === 'up') {
                  runningTotal += tier;
                } else if (transferDirection === 'down') {
                  runningTotal -= tier;
                } */
              return (
                <ActivityItem
                  key={transferEvent.transactionHash + transferEvent.token.number}
                  transferEvent={transferEventWithTier}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
}