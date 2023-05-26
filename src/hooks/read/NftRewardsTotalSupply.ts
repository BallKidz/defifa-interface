import { useChainData } from "../useChainData";
import { useContractRead } from "wagmi";

export function useNftRewardsTotalSupply(
  dataSourceAddress: string | undefined
) {
  const { chainData } = useChainData();

  const JBTiered721DelegateStore = chainData.JBTiered721DelegateStore;

  return useContractRead({
    addressOrName: JBTiered721DelegateStore?.address ?? "",
    contractInterface: JBTiered721DelegateStore?.interface ?? "",
    functionName: "totalSupply",
    args: dataSourceAddress,
    watch: true,
    chainId: chainData.chainId,
  });
}
