import { useConnectModal } from "@rainbow-me/rainbowkit";
import { constants, utils } from "ethers";
import { useChainData } from "hooks/useChainData";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { DefifaLaunchProjectData } from "../../types/interfaces";

const convertTo18Decimals = (value: number) => {
  const decimals = 18;
  // Convert the floating-point number to a fixed-point string
  const fixedValue = utils.parseUnits(value.toString(), decimals);
  return fixedValue.toString();
};

export function useCreateTournament(
  _launchProjectData?: DefifaLaunchProjectData
) {
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
          price: convertTo18Decimals(tier.price),
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
      "useCreateTournament::usePrepareContractWriteError::error",
      prepareContractWriteError,
      preparedLaunchProjectData
    );
  }

  const { data, write, error, isError } = useContractWrite(config);
  if (isError) {
    console.error("useCreateTournament::useContractWrite::error", error);
  }

  const {
    isLoading,
    isSuccess,
    isError: isWaitForTransactionError,
    error: waitForTransactionError,
  } = useWaitForTransaction({ hash: data?.hash });
  if (isWaitForTransactionError) {
    console.error(
      "useCreateTournament::useWaitForTransaction::error",
      waitForTransactionError
    );
  }

  const handleWrite = () => {
    if (!isConnected) {
      openConnectModal!();
    } else {
      console.log("useCreateTournament::payload", preparedLaunchProjectData);
      console.log("useCreateTournament::Contract call:", config);
      console.log("useCreateTournament::Contract call data:", data);
      write?.();
    }
  };

  return {
    data,
    write: handleWrite,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
