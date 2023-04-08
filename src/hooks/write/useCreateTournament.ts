import { useConnectModal } from "@rainbow-me/rainbowkit";
import BigNumber from "bignumber.js";
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
  return new BigNumber(value).times(new BigNumber(10).pow(18)).toNumber();
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
    overrides: chainData?.chainId == 5 ? { gasLimit: 21000000 } : {},

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
