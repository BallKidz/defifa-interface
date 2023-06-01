import Container from "components/UI/Container";
import { useGameActivity } from "./useGameActivity";
import { constants } from "ethers";
import Image from "next/image";

interface TransferEvent {
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
    };
  };
  transactionHash: string;
}

function RedeemEvent({ transferEvent }: { transferEvent: TransferEvent }) {
  return (
    <div className="flex justify-between">
      <div>
        <div className="mb-2">Redeem</div>
        <div className="border border-solid border-gray-800 block rounded-lg overflow-hidden">
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
      <div>{transferEvent.from.id}</div>
    </div>
  );
}

function PayEvent({ transferEvent }: { transferEvent: TransferEvent }) {
  return (
    <div className="flex justify-between">
      <div>
        <div className="mb-2">Mint</div>
        <div className="border border-solid border-gray-800 block rounded-lg overflow-hidden">
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
      <div>{transferEvent.to.id}</div>
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
  const { data: activity } = useGameActivity();

  const transfers = activity?.transfers;

  return (
    <Container>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto mt-8">
        {transfers?.map((transferEvent: TransferEvent) => (
          <ActivityItem
            key={transferEvent.transactionHash}
            transferEvent={transferEvent}
          />
        ))}
      </div>
    </Container>
  );
}
