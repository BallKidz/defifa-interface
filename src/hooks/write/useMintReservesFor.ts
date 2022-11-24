import { BigNumber } from "ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { simulateTransaction } from "../../lib/tenderly";
import { useOutstandingNumber } from "../read/OutStandingReservedTokens";
import { useChainData } from "../useChainData";

export function useMintReservesFor(simulate = true) {
  const network = useNetwork();
  const { address, connector, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { chainData } = useChainData();
  const outStanding = useOutstandingNumber();

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: chainData.defifaDelegate.address,
    contractInterface: chainData.defifaDelegate.interface,
    functionName: "mintReservesFor",
    args: [outStanding],
    overrides: { gasLimit: 21000000 },
    chainId: chainData.chainId,
    onError: (error) => {
      console.error(
        outStanding.map((o) => [
          BigNumber.from(o.tierId),
          BigNumber.from(o.count),
        ]),
        "ERRRRORRR",
        error
      );
    },
  });

  const simulateOutStanding = () => {
    console.log("simulateOutStanding");
    simulateTransaction({
      chainId: chainData.chainId,
      populatedTx: config.request,
      userAddress: address,
    });
  };

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return {
    data,
    write: () => {
      if (!isConnected) {
        openConnectModal!();
      }
      if (simulate) {
        simulateOutStanding();
      } else {
        write?.();
      }
    },
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
