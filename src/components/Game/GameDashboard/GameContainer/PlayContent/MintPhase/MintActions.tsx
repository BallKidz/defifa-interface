import Button from "components/UI/Button";
import { EthAmount } from "components/UI/EthAmount";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import { useGameContext } from "contexts/GameContext";
import { BigNumber, constants } from "ethers";
import { usePay } from "hooks/write/usePay";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toastSuccess } from "utils/toast";
import { useAccount } from "wagmi";
import { TierSelection } from "./useMintSelection";
import { PhaseTimer } from "../PhaseTimer";
import { Tooltip } from "antd";
import Link from "next/link";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export function MintActions({
  selectedTiers,
}: {
  selectedTiers: TierSelection | undefined;
}) {
  const [claimVotes, setClaimVotes] = useState(true);

  const { address } = useAccount();
  const {
    nfts: { tiers },
  } = useGameContext();
  const router = useRouter();

  const totalSelected = Object.values(selectedTiers ?? {}).reduce(
    (acc, curr) => acc + curr.count,
    0
  );
  const costWei =
    tiers?.reduce((acc, curr) => {
      const tierId = curr.id.toString();
      const count = selectedTiers?.[tierId]?.count ?? 0;
      return acc.add(curr.price.mul(count));
    }, BigNumber.from(0)) ?? BigNumber.from(0);

  const tierIdsToMint = Object.keys(selectedTiers ?? {}).reduce(
    (acc: number[], tierId) => {
      const tiers = Array(selectedTiers?.[tierId].count).fill(
        parseInt(tierId)
      ) as number[];
      return [...acc, ...tiers];
    },
    []
  );

  const { write, isLoading, isSuccess, isError } = usePay({
    amount: costWei.toString(),
    token: ETH_TOKEN_ADDRESS,
    minReturnedTokens: "0",
    preferClaimedTokens: true,
    memo: `Minted on defifa.net`,
    metadata: {
      _votingDelegate: claimVotes
        ? address ?? constants.AddressZero
        : constants.AddressZero,
      tierIdsToMint,
    },
    onSuccess() {
      toastSuccess("Mint complete");

      router.reload();
    },
  });

  const picksText = totalSelected === 1 ? "NFT" : "NFTs";

  if (!selectedTiers || totalSelected === 0) {
    return (
      <div>
        <div className="text-xl font-medium">Mint summary</div>
        <div>← Mint an NFT to join a team.</div>
      </div>
    );
  }

  console.log(selectedTiers, tiers);

  return (
    <div>
      <div className="text-xl font-medium mb-4">Mint summary</div>
      <div className="border-b border-neutral-700 pb-3">
        {Object.keys(selectedTiers)
          .filter((tierId) => selectedTiers[tierId].count > 0)
          .map((tierId) => {
            const tier = tiers?.[parseInt(tierId) - 1];
            const image = tier?.teamImage;
            const name = tier?.teamName;
            const count = selectedTiers?.[tierId].count;
            return (
              <div key={tierId}>
                {image ? (
                  <div className="flex gap-4 justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="rounded-lg border border-neutral-700 relative">
                        <Image
                          src={image}
                          crossOrigin="anonymous"
                          alt="NFT"
                          width={80}
                          className="rounded-lg"
                          height={80}
                        />
                        <div className="absolute text-sm shadow-md font-medium rounded-full bg-neutral-800 border border-neutral-700 flex items-center h-6 w-6 justify-center -top-2 -right-2">
                          {selectedTiers?.[tierId].count}
                        </div>
                      </div>
                      <div>{name}</div>
                    </div>
                    <div>
                      <EthAmount amountWei={tier.price.mul(count)} />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
      <div className="my-6">
        <div className="flex justify-between">
          <span className="text-neutral-300">NFTs</span>
          <span className="text-lg font-medium">{totalSelected}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-300">Total</span>
          <EthAmount className="text-lg font-medium" amountWei={costWei} />
        </div>

        <div className="flex gap-2 items-center mt-4">
          <input
            type="checkbox"
            name="claimVotes"
            id="claimVotes"
            checked={claimVotes}
            onChange={(e) => setClaimVotes(e.target.checked)}
          />
          <label htmlFor="claimVotes">Claim voting power</label>
          <Tooltip title="The game is self-reported. Claim voting power to have a say in how the pot is split. Unchecking will delegate your say to an account of the game deployers choosing.">
            <span>
              <Link href="/about" className="text-lime-500">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </Link>
            </span>
          </Tooltip>
        </div>
      </div>
      <Button
        loading={isLoading}
        size="lg"
        className="w-full"
        onClick={() => write?.()}
      >
        Mint now
      </Button>
    </div>
  );
}
