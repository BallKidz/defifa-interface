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

  const preparedLaunchProjectData = _launchProjectData
    ? {
        ..._launchProjectData,
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