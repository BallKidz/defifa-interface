import { useConnectModal } from "@rainbow-me/rainbowkit";
import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useChainData } from "hooks/useChainData";
import { DefifaLaunchProjectData } from "types/defifa";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useCreateGame(_launchProjectData?: DefifaLaunchProjectData) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { chainData } = useChainData();

  const defaultTokenUriResolver =
    _launchProjectData?.defaultTokenUriResolver || constants.AddressZero;
  const preparedLaunchProjectData = _launchProjectData
    ? {
        ..._launchProjectData,
        defaultTokenUriResolver,
        tiers: _launchProjectData.tiers.map((tier) => ({
          ...tier,
          price: parseEther(tier.price),
        })),
      }
    : undefined;

  const {
    config,
    error: prepareContractWriteError,
    isError: isPrepareContractWriteError,
  } = usePrepareContractWrite({
    addressOrName: chainData.DefifaDeployer.address,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "launchGameWith",
    args: [preparedLaunchProjectData],
    chainId: chainData.chainId,
  });
  if (isPrepareContractWriteError) {
    console.error(
      "useCreateGame::usePrepareContractWriteError::error",
      prepareContractWriteError,
      preparedLaunchProjectData
    );
  }

  const { data, write, error, isError } = useContractWrite(config);
  if (isError) {
    console.error("useCreateGame::useContractWrite::error", error);
  }

  const {
    isLoading,
    isSuccess,
    isError: isWaitForTransactionError,
    error: waitForTransactionError,
    data: transactionData,
  } = useWaitForTransaction({ hash: data?.hash });
  if (isWaitForTransactionError) {
    console.error(
      "useCreateGame::useWaitForTransaction::error",
      waitForTransactionError
    );
  }

  const handleWrite = () => {
    if (!isConnected) {
      openConnectModal!();
    } else {
      console.log("useCreateGame::payload", preparedLaunchProjectData);
      console.log("useCreateGame::Contract call:", config);
      console.log("useCreateGame::Contract call data:", data);
      write?.();
    }
  };

  return {
    data,
    transactionData,
    write: handleWrite,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
