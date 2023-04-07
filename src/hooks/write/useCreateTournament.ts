import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getChainData } from "../../constants/addresses";
import { DefifaLaunchProjectData } from "../../types/interfaces";

const convertDatetimeLocalToUnix = (value: string) => {
  return new Date(value).getTime() / 1000;
};

export function useCreateTournament(
  _launchProjectData?: DefifaLaunchProjectData
) {
  const network = useNetwork();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const chainData = getChainData(network?.chain?.id);

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: chainData.defifaCreate.address,
    contractInterface: chainData.defifaCreate.interface,
    functionName: "launchGameWith",
    args: [_launchProjectData],
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
