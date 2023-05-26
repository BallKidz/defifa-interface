import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useFetchGovernor(dataSource: string) {
  const { chainData } = useChainData();

  return useContractRead({
    addressOrName: dataSource,
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "owner",
    chainId: chainData.chainId,
  });
}
