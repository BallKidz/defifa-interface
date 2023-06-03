import Container from "components/UI/Container";
import { useGameActivity } from "./useGameActivity";
import { constants } from "ethers";
import Image from "next/image";
import moment from "moment";
import { ONE_BILLION } from "hooks/NftRewards";

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
        <div className="border border-solid border-gray-800 block rounded-lg overflow-hidden">
          <div>{transferEvent.from.id}</div>
          <div>
            Minted {transferEvent.token.metadata.name}{" "}
            {moment(parseInt(transferEvent.timestamp) * 1000).fromNow()}
          </div>
          <div>{transferEvent.tier}</div>
          <div>{transferEvent.token.number}</div>
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
  return (
    <div className="flex justify-between">
      <div>
        <div className="border border-solid border-gray-800 block rounded-lg overflow-hidden">
          <div>{transferEvent.to.id}</div>
          <div>
            Minted {transferEvent.token.metadata.name}{" "}
            {moment(parseInt(transferEvent.timestamp) * 1000).fromNow()}
          </div>
          <div>{transferEvent.tier}</div>
          <div>{transferEvent.token.number}</div>
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

function ActivityItem({ transferEvent }: { transferEvent: TransferEvent }) {
  if (transferEvent.to.id === constants.AddressZero) {
    return <RedeemEvent transferEvent={transferEvent} />;
  }
  if (transferEvent.from.id === constants.AddressZero) {
    return <PayEvent transferEvent={transferEvent} />;
  }

  return null;
}

export function ActivityContent() {
  const { data: activity, isLoading } = useGameActivity();

  const transfers = activity?.transfers;
  console.log(transfers);
  if (isLoading) {
    return <Container className="text-center">...</Container>;
  }

  if (!transfers || transfers.length === 0) {
    return <Container className="text-center">No activity yet.</Container>;
  }
  const reformattedArray: ActivityEvent[] = transfers.map(
    (obj: TransferEvent) => {
      const activityEvent = { ...obj };
      const fromId = activityEvent.from.id;
      const toId = activityEvent.to.id;

      if (toId === constants.AddressZero) {
        (activityEvent as ActivityEvent).action = "Redeem";
        (activityEvent as ActivityEvent).nonZeroId = fromId;
      } else if (fromId === constants.AddressZero) {
        (activityEvent as ActivityEvent).action = "Mint";
        (activityEvent as ActivityEvent).nonZeroId = toId;
      }

      obj.tier = Math.floor(parseInt(obj.token.number) / ONE_BILLION);

      return obj;
    }
  );

  return (
    <Container className="mb-12">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto mt-8">
        {reformattedArray
          .sort((a, b) => {
            if (a.nonZeroId === b.nonZeroId) {
              return parseInt(a.token.number) - parseInt(b.token.number);
            }
            return a.nonZeroId < b.nonZeroId ? -1 : 1;
          })
          .map((transferEvent) => {
            const transferEventWithTier = {
              ...transferEvent,
            };

            return (
              <ActivityItem
                key={transferEvent.transactionHash + transferEvent.token.number}
                transferEvent={transferEventWithTier}
              />
            );
          })}
      </div>
    </Container>
  );
}