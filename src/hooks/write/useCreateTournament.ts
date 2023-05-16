import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber, utils } from "ethers";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getChainData } from "../../constants/addresses";
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
    _launchProjectData?.defaultTokenUriResolver ||
    "0x0000000000000000000000000000000000000000";

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

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: chainData.defifaCreate.address,
    contractInterface: chainData.defifaCreate.interface,
    functionName: "launchGameWith",
    args: [preparedLaunchProjectData],
    chainId: chainData.chainId,
  });

  const { data, write, error, isError } = useContractWrite(config);
  
  console.log("payload", preparedLaunchProjectData);
  console.log("Contract call:", config);
  console.log("Contract call data:", data);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  const handleWrite = () => {
    if (!isConnected) {
      openConnectModal!();
    } else {
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
