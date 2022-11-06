import DefifaDeployer from "@jbx-protocol/juice-defifa/out/DefifaDeployer.sol/DefifaDeployer.json";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getChainData } from "../../constants/addresses";
import { simulateTransaction } from "../../lib/tenderly";

export function useQueueNextPhase(simulate = false) {
  const network = useNetwork();
  const { address, connector, isConnected } = useAccount();

  const chainData = getChainData(network?.chain?.id);
  console.log("PROJECT ID", chainData.projectId);
  const { config, error: err } = usePrepareContractWrite({
    addressOrName: chainData.defifaDeployer,
    contractInterface: DefifaDeployer.abi,
    functionName: "queueNextPhaseOf",
    args: [chainData.projectId],
    chainId: chainData.chainId,
    overrides: { gasLimit: 210000 },
    onError: (err) => console.log(err),
  });

  const simulateQueueNextPhase = () => {
    console.log(config);
    console.log(err);
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
    write: simulate ? simulateQueueNextPhase : write,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
