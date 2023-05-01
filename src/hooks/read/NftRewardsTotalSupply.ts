import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useNftRewardsTotalSupply(dataSourceAddress: string | undefined) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

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
