import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber, constants, utils } from "ethers";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getChainData } from "config";
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
  const network = useNetwork();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const chainData = getChainData(network?.chain?.id);

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
    addressOrName: chainData.DefifaCreate.address,
    contractInterface: chainData.DefifaCreate.interface,
    functionName: "launchGameWith",
    args: [preparedLaunchProjectData],
    chainId: chainData.chainId,
  });
  if (isPrepareContractWriteError) {
    console.error(
      "useCreateTournament::usePrepareContractWriteError::error",
      prepareContractWriteError
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
